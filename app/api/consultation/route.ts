import { randomBytes } from 'node:crypto';
import nodemailer from 'nodemailer';
import { consultationSchema, fieldErrors, type ConsultationRequest } from '@/lib/consultation';

export const runtime = 'nodejs';

/*
 * Consultation request endpoint.
 *  - Validates server-side (zod), rejects oversized bodies, checks Origin.
 *  - Spam: honeypot field + minimum fill time + per-IP rate limit.
 *    NOTE: the rate limiter is in-memory (per server instance), like the existing
 *    Drive Edge beta endpoint. On multi-instance/serverless hosting, add an edge
 *    or WAF rate limit as defence in depth.
 *  - Delivery: SMTP via nodemailer. Nothing is stored by this site; the inquiry
 *    exists only in the team mailbox. Inquiry contents are never logged.
 */
const MAX_BODY_BYTES = 16 * 1024;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 4;
const attempts = new Map<string, number[]>();

const serviceLabels: Record<string, string> = {
  general: 'General enquiry / not sure yet',
  consultancy: 'IT Consultancy & Digital Transformation',
  audit: 'Independent IT Auditing',
  tender: 'Public Tender & Procurement Advisory',
  oversight: 'Project Oversight & Quality Assurance',
  ai: 'AI, Automation & Systems Integration',
  public: 'Public Sector & Institutional Services',
  private: 'Private Business Consultancy',
  healthcheck: 'Technology Project Health Check follow-up',
};
const typeLabels: Record<string, string> = { private: 'Private business', public: 'Public institution', nonprofit: 'Nonprofit / association', other: 'Other' };

function json(payload: unknown, status = 200) {
  return Response.json(payload, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}

const escapeHtml = (v: string | undefined) =>
  (v ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
/** Single-line safe value for email headers/subjects. */
const oneLine = (v: string) => v.replace(/[\r\n]+/g, ' ').slice(0, 120);

function clientAddress(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(address: string, now: number) {
  const recent = (attempts.get(address) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    attempts.set(address, recent);
    return true;
  }
  recent.push(now);
  attempts.set(address, recent);
  if (attempts.size > 2_000) {
    for (const [key, stamps] of attempts) if (stamps.every((t) => now - t >= RATE_WINDOW_MS)) attempts.delete(key);
  }
  return false;
}

function hasTrustedOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    const url = new URL(origin);
    const host = request.headers.get('host');
    return (url.protocol === 'https:' && ['saasolution.es', 'www.saasolution.es'].includes(url.hostname))
      || (process.env.NODE_ENV !== 'production' && url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))
      || Boolean(host && url.host === host && url.protocol === 'https:');
  } catch {
    return false;
  }
}

function configuration() {
  const host = process.env.CONSULTATION_SMTP_HOST;
  const port = Number(process.env.CONSULTATION_SMTP_PORT || '587');
  const user = process.env.CONSULTATION_SMTP_USER;
  const pass = process.env.CONSULTATION_SMTP_PASSWORD;
  const from = process.env.CONSULTATION_FROM_EMAIL;
  // hello@saasolution.es is the contact address already published on the site.
  const to = process.env.CONSULTATION_TO_EMAIL || 'hello@saasolution.es';
  if (!host || !Number.isInteger(port) || !user || !pass || !from) throw new Error('Consultation email delivery is not configured.');
  return { host, port, user, pass, from, to };
}

async function deliver(data: ConsultationRequest, id: string) {
  const config = configuration();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    requireTLS: config.port !== 465,
    auth: { user: config.user, pass: config.pass },
    tls: { minVersion: 'TLSv1.2' },
  });
  const includeSummary = data.attachSummary === true && Boolean(data.summary);
  const rows: [string, string][] = [
    ['Reference', id],
    ['Source', data.service === 'healthcheck' || includeSummary ? 'Health Check follow-up' : 'Direct consultation request'],
    ['Name', data.fullName],
    ['Organization', data.organization],
    ['Email', data.email],
    ['Phone', data.phone || '—'],
    ['Country / region', data.country],
    ['Organization type', typeLabels[data.organizationType]],
    ['Service of interest', serviceLabels[data.service]],
    ['Preferred language', data.language === 'es' ? 'Español' : 'English'],
    ['Project description', data.message],
    ['Health Check summary attached (visitor consented)', includeSummary ? 'Yes' : 'No'],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + (includeSummary ? `\n\n--- Health Check summary (self-reported, preliminary) ---\n${data.summary}` : '');
  const html = `<h1>Consultation request ${escapeHtml(id)}</h1><table style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #e6e9e3;vertical-align:top">${escapeHtml(k)}</th><td style="padding:8px 12px;border-bottom:1px solid #e6e9e3;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`).join('')}</table>${includeSummary ? `<h2>Health Check summary</h2><pre style="white-space:pre-wrap">${escapeHtml(data.summary)}</pre>` : ''}`;

  await transporter.sendMail({
    from: config.from,
    to: config.to,
    replyTo: data.email,
    subject: `[Consulting] ${serviceLabels[data.service]} — ${oneLine(data.organization)} (${id})`,
    text,
    html,
  });

  // Acknowledgement to the visitor. Failure here must not fail the inquiry.
  let acknowledged = true;
  try {
    const es = data.language === 'es';
    await transporter.sendMail({
      from: config.from,
      to: data.email,
      replyTo: config.to,
      subject: es ? `Hemos recibido su consulta (${id})` : `We have received your enquiry (${id})`,
      text: es
        ? `Hola ${oneLine(data.fullName)},\n\nHemos recibido su solicitud (referencia ${id}). Nuestro equipo la revisará y le responderá para concertar una primera conversación.\n\nSu mensaje se ha enviado únicamente por correo electrónico a SaaSolution; no se almacena en este sitio web. Puede solicitar el acceso, la rectificación o la supresión de sus datos escribiendo a ${config.to}.\n\nSaaSolutions SL`
        : `Hello ${oneLine(data.fullName)},\n\nWe have received your request (reference ${id}). Our team will review it and reply to arrange an initial conversation.\n\nYour message was sent to SaaSolution by email only; it is not stored on this website. You can ask for access, correction or deletion of your data by writing to ${config.to}.\n\nSaaSolutions SL`,
    });
  } catch {
    acknowledged = false;
  }
  return { acknowledged };
}

export async function POST(request: Request) {
  const now = Date.now();
  if (!hasTrustedOrigin(request)) return json({ error: 'origin' }, 403);
  if (Number(request.headers.get('content-length') || '0') > MAX_BODY_BYTES) return json({ error: 'tooLarge' }, 413);
  if (isRateLimited(clientAddress(request), now)) return json({ error: 'rateLimit' }, 429);

  let raw: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) return json({ error: 'tooLarge' }, 413);
    raw = JSON.parse(text);
  } catch {
    return json({ error: 'unreadable' }, 400);
  }

  const parsed = consultationSchema.safeParse(raw);
  if (!parsed.success) return json({ error: 'validation', fields: fieldErrors(parsed.error) }, 400);
  const data = parsed.data;

  // Honeypot: pretend success so bots learn nothing.
  if (data.website) return json({ reference: 'CONS-RECEIVED' });
  if (now - data.startedAt < 3_000 || now - data.startedAt > 4 * 60 * 60 * 1000) return json({ error: 'stale' }, 400);

  const id = `CONS-${new Date(now).toISOString().slice(0, 10).replaceAll('-', '')}-${randomBytes(3).toString('hex').toUpperCase()}`;
  try {
    const { acknowledged } = await deliver(data, id);
    return json({ reference: id, acknowledged });
  } catch {
    // Deliberately no logging of the inquiry; only a generic failure is returned.
    return json({ error: 'delivery' }, 503);
  }
}
