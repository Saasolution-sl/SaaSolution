'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Lang } from '@/lib/health-check/questions';
import { consultationSchema, consultationServices, fieldErrors, organizationTypes, type ConsultationErrorCode } from '@/lib/consultation';
import { tr, type SiteLocale } from '@/lib/consulting/content';
import { useSiteLocale } from '@/app/i18n/language-provider';
import { ui } from '@/lib/consulting/ui';
import { track } from '@/lib/consulting/analytics';

type Props = {
  lang: Lang;
  /** Pre-filled when arriving from the Health Check. */
  summary?: string;
  defaultService?: (typeof consultationServices)[number];
  defaultOrgType?: (typeof organizationTypes)[number];
  /** Omit the form's own heading/intro when the page already shows them (e.g. the consultation page hero). */
  headless?: boolean;
};

type Status = 'idle' | 'sending' | 'success' | 'error';

export function ConsultationForm({ lang, summary, defaultService = 'general', defaultOrgType, headless = false }: Props) {
  const { locale } = useSiteLocale();
  const tl: SiteLocale = lang === 'es' ? 'es' : locale;
  const f = ui.form;
  const [errors, setErrors] = useState<Partial<Record<string, ConsultationErrorCode>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [failure, setFailure] = useState<string>('');
  const [reference, setReference] = useState('');
  const startedAt = useRef(0);
  const started = useRef(false);
  const [focusTick, setFocusTick] = useState(0);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Timestamp used as a minimum-fill-time spam signal. Set after mount so it is not part of SSR output.
  useEffect(() => { startedAt.current = Date.now(); }, []);
  useEffect(() => { if (status === 'success') successRef.current?.focus(); }, [status]);
  useEffect(() => { if (focusTick > 0) errorRef.current?.focus(); }, [focusTick]);

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    track('consultation_form_start', { source: summary ? 'health-check' : 'direct' });
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (k: string) => String(form.get(k) ?? '');
    const attach = form.get('attachSummary') === 'on';
    const candidate = {
      fullName: text('fullName'),
      organization: text('organization'),
      email: text('email'),
      phone: text('phone') || undefined,
      country: text('country'),
      organizationType: text('organizationType'),
      service: text('service'),
      message: text('message'),
      language: text('language'),
      privacyAccepted: form.get('privacyAccepted') === 'on',
      attachSummary: summary ? attach : undefined,
      summary: summary && attach ? summary : undefined,
      website: text('website'),
      startedAt: startedAt.current,
    };
    const parsed = consultationSchema.safeParse(candidate);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setStatus('idle');
      setFocusTick((t) => t + 1);
      return;
    }
    setErrors({});
    setFailure('');
    setStatus('sending');
    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const body = await response.json().catch(() => ({}));
      if (response.ok) {
        setReference(body.reference ?? '');
        setStatus('success');
        track('consultation_submitted', { source: summary && attach ? 'health-check' : 'direct' });
        return;
      }
      if (body.error === 'validation' && body.fields) {
        setErrors(body.fields);
        setStatus('idle');
        setFocusTick((t) => t + 1);
        return;
      }
      setFailure(body.error === 'rateLimit' ? 'rateLimit' : body.error === 'delivery' ? 'delivery' : 'generic');
      setStatus('error');
      setFocusTick((t) => t + 1);
    } catch {
      setFailure('network');
      setStatus('error');
      setFocusTick((t) => t + 1);
    }
  }

  if (status === 'success') {
    return (
      <div className="cx-form-success" role="status" tabIndex={-1} ref={successRef}>
        <h2>{tr(f.successTitle, tl)}</h2>
        <p>{tr(f.successText, tl)}</p>
        {reference && <p><strong>{tr(f.reference, tl)}:</strong> <code>{reference}</code></p>}
      </div>
    );
  }

  const err = (name: string) => errors[name];
  const errText = (name: string) => { const c = err(name); return c ? tr(f.errors[c], tl) : ''; };
  const hasErrors = Object.keys(errors).length > 0;

  const field = (name: string, label: string, input: React.ReactNode, hint?: string) => (
    <div className={`cx-field${err(name) ? ' has-error' : ''}`}>
      <label htmlFor={`f-${name}`}>{label}</label>
      {hint && <p className="cx-hint" id={`h-${name}`}>{hint}</p>}
      {input}
      {err(name) && <p className="cx-error" id={`e-${name}`}>{errText(name)}</p>}
    </div>
  );
  const aria = (name: string, hint = false) => ({
    id: `f-${name}`, name,
    'aria-invalid': err(name) ? true : undefined,
    'aria-describedby': [err(name) ? `e-${name}` : '', hint ? `h-${name}` : ''].filter(Boolean).join(' ') || undefined,
  });

  return (
    <form className="cx-form" onSubmit={onSubmit} onFocus={markStarted} noValidate {...(headless ? { 'aria-label': tr(f.title, tl) } : { 'aria-labelledby': 'form-title' })}>
      {!headless && <><h2 id="form-title">{tr(f.title, tl)}</h2>
      <p>{tr(f.intro, tl)}</p></>}

      <div ref={errorRef} tabIndex={-1} role={hasErrors || status === 'error' ? 'alert' : undefined} className={hasErrors || status === 'error' ? 'cx-alert' : undefined}>
        {hasErrors && <p>{tr(f.errorSummary, tl)}</p>}
        {status === 'error' && <p>{tr(f.failures[failure] ?? f.failures.generic, tl)}</p>}
      </div>

      <div className="cx-grid">
        {field('fullName', tr(f.fullName, tl), <input type="text" autoComplete="name" required {...aria('fullName')} />)}
        {field('organization', tr(f.organization, tl), <input type="text" autoComplete="organization" required {...aria('organization')} />)}
        {field('email', tr(f.email, tl), <input type="email" autoComplete="email" inputMode="email" required {...aria('email')} />)}
        {field('phone', tr(f.phone, tl), <input type="tel" autoComplete="tel" {...aria('phone')} />)}
        {field('country', tr(f.country, tl), <input type="text" autoComplete="country-name" required {...aria('country')} />)}
        {field('organizationType', tr(f.organizationType, tl),
          <select defaultValue={defaultOrgType ?? ''} required {...aria('organizationType')}>
            <option value="" disabled>{tr(f.choose, tl)}</option>
            {organizationTypes.map((o) => <option key={o} value={o}>{tr(f.orgTypes[o], tl)}</option>)}
          </select>)}
        {field('service', tr(f.service, tl),
          <select defaultValue={defaultService} required {...aria('service')}>
            {consultationServices.map((s) => <option key={s} value={s}>{tr(f.services[s], tl)}</option>)}
          </select>)}
        {field('language', tr(f.language, tl),
          <select defaultValue={lang} {...aria('language')}>
            <option value="en">{tr(f.languages.en, tl)}</option>
            <option value="es">{tr(f.languages.es, tl)}</option>
          </select>)}
      </div>

      {field('message', tr(f.message, tl), <textarea rows={6} maxLength={2000} required {...aria('message', true)} />, tr(f.messageHint, tl))}

      {summary && (
        <fieldset className="cx-attach">
          <legend>{tr(f.attachTitle, tl)}</legend>
          <p>{tr(f.attachText, tl)}</p>
          <pre tabIndex={0} aria-label={tr(f.attachTitle, tl)}>{summary}</pre>
          <label className="cx-check"><input type="checkbox" name="attachSummary" /> {tr(f.attachLabel, tl)}</label>
        </fieldset>
      )}

      {/* Honeypot: hidden from people and assistive tech. */}
      <div className="cx-honeypot" aria-hidden="true">
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <details className="cx-privacy">
        <summary>{tr(f.privacyTitle, tl)}</summary>
        <p>{tr(f.privacyText, tl)} <Link href="/privacy">{tr(ui.footerPrivacy, tl)}</Link></p>
      </details>

      <div className={`cx-field${err('privacyAccepted') ? ' has-error' : ''}`}>
        <label className="cx-check">
          <input type="checkbox" {...aria('privacyAccepted')} required />
          <span>{tr(f.privacy, tl)}</span>
        </label>
        {err('privacyAccepted') && <p className="cx-error" id="e-privacyAccepted">{errText('privacyAccepted')}</p>}
      </div>

      <button type="submit" className="cx-btn" disabled={status === 'sending'} aria-busy={status === 'sending'}>
        {status === 'sending' ? tr(f.sending, tl) : tr(f.submit, tl)}
      </button>
    </form>
  );
}
