import { randomBytes } from 'node:crypto';
import nodemailer from 'nodemailer';
import {
  downloadForPlatform,
  edgeBetaApplicationSchema,
  edgeBetaRelease,
  qualifyEdgeBetaApplication,
  type EdgeBetaApplication,
  type EdgeBetaOutcome,
} from '@/lib/edge-beta-application';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 32 * 1024;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 5;
const attempts = new Map<string, number[]>();

const labels = {
  applicationType: { business: 'Business or organization', individual: 'Individual' },
  organizationSize: { solo: 'Solo business', '2-10': '2–10 people', '11-50': '11–50 people', '51-250': '51–250 people', '251-plus': '251+ people' },
  individualUse: { 'home-lab': 'Home lab', consulting: 'Client consulting', 'product-evaluation': 'Product evaluation', other: 'Other' },
  platform: { 'linux-amd64': 'Linux x86-64', 'linux-arm64': 'Linux ARM64', 'raspberry-pi': 'Raspberry Pi OS 64-bit', other: 'Other platform' },
  locations: { one: 'One', two: 'Two', 'three-plus': 'Three or more' },
  dataSize: { 'under-100gb': 'Under 100 GB', '100gb-1tb': '100 GB–1 TB', 'over-1tb': 'Over 1 TB' },
  cubbitReadiness: { ready: 'Already available', 'can-create': 'Can create a test project', 'not-ready': 'Needs guidance' },
  linuxExperience: { comfortable: 'Comfortable', 'with-guidance': 'Comfortable with guidance', 'new-to-linux': 'New to Linux' },
  startWindow: { now: 'Ready now', 'within-30-days': 'Within 30 days', researching: 'Researching' },
} as const;

function json(payload: unknown, status = 200) {
  return Response.json(payload, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function escapeHtml(value: string | undefined) {
  return (value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function clientAddress(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

function isRateLimited(address: string, now: number) {
  const recent = (attempts.get(address) ?? []).filter((timestamp) => now - timestamp < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    attempts.set(address, recent);
    return true;
  }
  recent.push(now);
  attempts.set(address, recent);
  if (attempts.size > 2_000) {
    for (const [key, timestamps] of attempts) {
      if (timestamps.every((timestamp) => now - timestamp >= RATE_WINDOW_MS)) attempts.delete(key);
    }
  }
  return false;
}

function hasTrustedOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    const originUrl = new URL(origin);
    const requestHost = request.headers.get('host');
    return originUrl.protocol === 'https:' && ['saasolution.es', 'www.saasolution.es'].includes(originUrl.hostname)
      || originUrl.protocol === 'http:' && ['127.0.0.1:4173', 'localhost:4173'].includes(originUrl.host)
      || Boolean(requestHost && originUrl.host === requestHost && originUrl.protocol === 'https:');
  } catch {
    return false;
  }
}

function applicationId(now: Date) {
  const date = now.toISOString().slice(0, 10).replaceAll('-', '');
  return `EDGE-${date}-${randomBytes(3).toString('hex').toUpperCase()}`;
}

function outcomeCopy(outcome: EdgeBetaOutcome) {
  if (outcome === 'instant-access') {
    return 'Your answers fit the supported 30-day beta scope. Download the signed package below and keep this email for the verification hash.';
  }
  if (outcome === 'guided-review') {
    return 'Your environment needs a short technical review before we issue a download. The beta team will reply with the safest next step.';
  }
  return 'That platform is not in the current Linux beta. We have added your request to the platform waitlist and will contact you when support changes.';
}

function applicationSummary(application: EdgeBetaApplication, id: string, outcome: EdgeBetaOutcome) {
  return [
    ['Application', id],
    ['Outcome', outcome],
    ['Applicant type', labels.applicationType[application.applicationType]],
    ['Organization', application.organizationName || '—'],
    ['Organization size', application.organizationSize ? labels.organizationSize[application.organizationSize] : '—'],
    ['Role / intended use', application.applicationType === 'business' ? application.role || '—' : application.individualUse ? labels.individualUse[application.individualUse] : '—'],
    ['Country', application.country],
    ['Platform', application.platform === 'other' ? application.otherPlatform || 'Other' : labels.platform[application.platform]],
    ['Locations', labels.locations[application.locations]],
    ['Test data', labels.dataSize[application.dataSize]],
    ['Cubbit DS3', labels.cubbitReadiness[application.cubbitReadiness]],
    ['Linux experience', labels.linuxExperience[application.linuxExperience]],
    ['Start window', labels.startWindow[application.startWindow]],
    ['Name', application.fullName],
    ['Email', application.email],
    ['Phone', application.phone || '—'],
    ['Product updates', application.productUpdates ? 'Yes' : 'No'],
    ['Notes', application.notes || '—'],
  ] as const;
}

function configuration() {
  const host = process.env.EDGE_BETA_SMTP_HOST;
  const port = Number(process.env.EDGE_BETA_SMTP_PORT || '587');
  const user = process.env.EDGE_BETA_SMTP_USER;
  const pass = process.env.EDGE_BETA_SMTP_PASSWORD;
  const from = process.env.EDGE_BETA_FROM_EMAIL;
  const applicationsTo = process.env.EDGE_BETA_APPLICATION_EMAIL;
  if (!host || !Number.isInteger(port) || !user || !pass || !from || !applicationsTo) {
    throw new Error('Beta email delivery is not configured.');
  }
  return { host, port, user, pass, from, applicationsTo };
}

async function deliverApplication(application: EdgeBetaApplication, id: string, outcome: EdgeBetaOutcome) {
  const config = configuration();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    requireTLS: config.port !== 465,
    auth: { user: config.user, pass: config.pass },
    tls: { minVersion: 'TLSv1.2' },
  });
  const rows = applicationSummary(application, id, outcome);
  const download = outcome === 'instant-access' ? downloadForPlatform(application.platform) : null;
  const downloadHref = download ? `${edgeBetaRelease.base}/${download.file}` : undefined;
  const absoluteDownload = downloadHref ? `https://saasolution.es${downloadHref}` : undefined;
  const internalText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
  const internalHtml = rows.map(([label, value]) => `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #e6e9e3">${escapeHtml(label)}</th><td style="padding:8px 12px;border-bottom:1px solid #e6e9e3">${escapeHtml(value)}</td></tr>`).join('');

  await transporter.sendMail({
    from: config.from,
    to: config.applicationsTo,
    replyTo: application.email,
    subject: `[${outcome}] Drive Edge beta application ${id}`,
    text: internalText,
    html: `<h1>Drive Edge beta application</h1><table style="border-collapse:collapse">${internalHtml}</table>`,
  });

  let applicantEmailDelivered = true;
  try {
    await transporter.sendMail({
      from: config.from,
      to: application.email,
      replyTo: config.applicationsTo,
      subject: outcome === 'instant-access' ? 'Your SaaSolution Drive Edge beta download' : 'Your SaaSolution Drive Edge beta application',
      text: [
        `Hello ${application.fullName},`,
        '',
        outcomeCopy(outcome),
        '',
        `Application: ${id}`,
        absoluteDownload ? `Download: ${absoluteDownload}` : '',
        download ? `SHA-256: ${download.sha256}` : '',
        '',
        'Keep an independent backup and read the beta installation guide before enabling synchronization.',
        'https://saasolution.es/drive/edge/install',
        '',
        'SaaSolution Drive Beta',
      ].filter(Boolean).join('\n'),
      html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#10201e"><p style="color:#60706b;font-size:12px;text-transform:uppercase;letter-spacing:.12em">Application ${escapeHtml(id)}</p><h1 style="font-size:36px;line-height:1.05">${outcome === 'instant-access' ? 'Your beta download is ready.' : outcome === 'guided-review' ? 'We’re reviewing your pilot.' : 'You’re on the platform waitlist.'}</h1><p style="font-size:16px;line-height:1.7">Hello ${escapeHtml(application.fullName)},</p><p style="font-size:16px;line-height:1.7">${escapeHtml(outcomeCopy(outcome))}</p>${absoluteDownload && download ? `<p style="margin:30px 0"><a href="${escapeHtml(absoluteDownload)}" style="display:inline-block;padding:15px 22px;border-radius:999px;background:#10201e;color:#fff;text-decoration:none;font-weight:bold">Download ${escapeHtml(download.label)}</a></p><p style="font-size:11px;color:#60706b;word-break:break-all">SHA-256: ${download.sha256}</p>` : ''}<p style="margin-top:32px;padding:18px;background:#f2e6d3;line-height:1.6"><strong>Before installation:</strong> keep an independent backup and read the <a href="https://saasolution.es/drive/edge/install">beta installation guide</a>.</p><p style="margin-top:30px;color:#60706b">SaaSolution Drive Beta<br><a href="mailto:beta@saasolution.es">beta@saasolution.es</a></p></div>`,
    });
  } catch {
    applicantEmailDelivered = false;
  }
  return { applicantEmailDelivered, download, downloadHref };
}

export async function POST(request: Request) {
  const now = Date.now();
  if (!hasTrustedOrigin(request)) return json({ error: 'This application origin is not allowed.' }, 403);
  const declaredLength = Number(request.headers.get('content-length') || '0');
  if (declaredLength > MAX_BODY_BYTES) return json({ error: 'The application is too large.' }, 413);
  if (isRateLimited(clientAddress(request), now)) return json({ error: 'Too many attempts. Please try again in 15 minutes.' }, 429);

  let raw: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) return json({ error: 'The application is too large.' }, 413);
    raw = JSON.parse(text);
  } catch {
    return json({ error: 'The application could not be read.' }, 400);
  }

  const parsed = edgeBetaApplicationSchema.safeParse(raw);
  if (!parsed.success) return json({ error: 'Please review the highlighted answers and try again.' }, 400);
  const application = parsed.data;
  if (application.website) {
    return json({ applicationId: 'EDGE-RECEIVED', outcome: 'guided-review', message: 'Your application was received.' });
  }
  if (now - application.startedAt < 3_000 || now - application.startedAt > 2 * 60 * 60 * 1000) {
    return json({ error: 'Please reload the form and submit again.' }, 400);
  }

  const id = applicationId(new Date(now));
  const outcome = qualifyEdgeBetaApplication(application);
  try {
    const delivery = await deliverApplication(application, id, outcome);
    return json({
      applicationId: id,
      outcome,
      message: `${outcomeCopy(outcome)}${delivery.applicantEmailDelivered ? '' : ' Your application is saved, but the confirmation email is delayed.'}`,
      download: delivery.download && delivery.downloadHref ? {
        href: delivery.downloadHref,
        label: delivery.download.label,
        sha256: delivery.download.sha256,
      } : undefined,
    });
  } catch {
    return json({ error: 'Email delivery is temporarily unavailable. Please try again shortly.' }, 503);
  }
}
