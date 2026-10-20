'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Check, Download, LoaderCircle, MailCheck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch, type FieldError, type FieldValues, type Path, type UseFormRegister } from 'react-hook-form';
import {
  edgeBetaApplicationSchema,
  type EdgeBetaApplication,
  type EdgeBetaOutcome,
} from '@/lib/edge-beta-application';

type ApplicationResult = {
  applicationId: string;
  outcome: EdgeBetaOutcome;
  message: string;
  download?: { href: string; label: string; sha256: string };
};

type Choice = { value: string; label: string; detail?: string };

const stepFields: Array<Array<Path<EdgeBetaApplication>>> = [
  ['applicationType', 'organizationName', 'organizationSize', 'role', 'individualUse', 'country'],
  ['platform', 'otherPlatform', 'locations', 'dataSize', 'cubbitReadiness', 'linuxExperience', 'startWindow'],
  ['backupConfirmed', 'testScopeConfirmed', 'operatorConfirmed'],
  ['fullName', 'email', 'phone', 'notes', 'privacyAccepted', 'betaTermsAccepted', 'productUpdates'],
];

const steps = ['About you', 'Your test', 'Safety', 'Contact'];

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileApi = {
  render: (container: HTMLElement, options: { sitekey: string; callback: (token: string) => void; 'expired-callback': () => void; 'error-callback': () => void }) => string;
  reset: (widgetId?: string) => void;
};
declare global {
  interface Window { turnstile?: TurnstileApi }
}

function TurnstileWidget({ onToken, resetKey }: { onToken: (token: string) => void; resetKey: number }) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!scriptReady || !turnstileSiteKey || !container.current || widgetId.current) return;
    widgetId.current = window.turnstile?.render(container.current, {
      sitekey: turnstileSiteKey,
      callback: onToken,
      'expired-callback': () => onToken(''),
      'error-callback': () => onToken(''),
    });
  }, [scriptReady, onToken]);

  useEffect(() => {
    if (resetKey > 0 && widgetId.current) window.turnstile?.reset(widgetId.current);
  }, [resetKey]);

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => setScriptReady(true)} />
      <div ref={container} />
    </>
  );
}

function ChoiceGroup<T extends FieldValues>({
  name,
  label,
  choices,
  register,
  error,
}: {
  name: Path<T>;
  label: string;
  choices: Choice[];
  register: UseFormRegister<T>;
  error?: FieldError;
}) {
  return (
    <fieldset className="beta-fieldset">
      <legend>{label}</legend>
      <div className="beta-choice-grid">
        {choices.map((choice) => (
          <label key={choice.value} className="beta-choice">
            <input type="radio" value={choice.value} {...register(name)} />
            <span><b>{choice.label}</b>{choice.detail && <small>{choice.detail}</small>}</span>
            <i><Check /></i>
          </label>
        ))}
      </div>
      {error && <p className="beta-field-error" role="alert">{error.message}</p>}
    </fieldset>
  );
}

function CheckField({
  name,
  children,
  register,
  error,
}: {
  name: 'backupConfirmed' | 'testScopeConfirmed' | 'operatorConfirmed' | 'privacyAccepted' | 'betaTermsAccepted' | 'productUpdates';
  children: React.ReactNode;
  register: UseFormRegister<EdgeBetaApplication>;
  error?: FieldError;
}) {
  return (
    <div>
      <label className="beta-check">
        <input type="checkbox" {...register(name)} />
        <span><Check /></span>
        <b>{children}</b>
      </label>
      {error && <p className="beta-field-error" role="alert">{error.message}</p>}
    </div>
  );
}

export function BetaApplicationForm() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<ApplicationResult | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileReset, setTurnstileReset] = useState(0);
  const {
    register,
    handleSubmit,
    trigger,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EdgeBetaApplication>({
    resolver: zodResolver(edgeBetaApplicationSchema),
    defaultValues: {
      applicationType: 'business',
      organizationName: '',
      role: '',
      country: '',
      otherPlatform: '',
      phone: '',
      notes: '',
      backupConfirmed: false as never,
      testScopeConfirmed: false as never,
      operatorConfirmed: false as never,
      privacyAccepted: false as never,
      betaTermsAccepted: false as never,
      productUpdates: false,
      website: '',
      startedAt: 0,
    },
    mode: 'onTouched',
  });

  const applicationType = useWatch({ control, name: 'applicationType' });
  const platform = useWatch({ control, name: 'platform' });

  useEffect(() => {
    setValue('startedAt', Date.now());
  }, [setValue]);

  async function nextStep() {
    const valid = await trigger(stepFields[step], { shouldFocus: true });
    if (valid) setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  async function submit(application: EdgeBetaApplication) {
    setSubmitError('');
    if (turnstileSiteKey && !turnstileToken) {
      setSubmitError('Please complete the security check before submitting.');
      return;
    }
    try {
      const response = await fetch('/api/drive/edge/beta/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...application, turnstileToken }),
      });
      const payload = await response.json() as ApplicationResult | { error?: string };
      if (!response.ok || !('outcome' in payload)) {
        throw new Error('error' in payload && payload.error ? payload.error : 'We could not submit your application.');
      }
      setResult(payload);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'We could not submit your application.');
      setTurnstileToken('');
      setTurnstileReset((count) => count + 1);
    }
  }

  if (result) {
    return (
      <div className={`beta-result ${result.outcome}`} aria-live="polite">
        <div className="beta-result-icon">{result.outcome === 'instant-access' ? <Download /> : <MailCheck />}</div>
        <p className="edge-kicker">Application {result.applicationId}</p>
        <h3>{result.outcome === 'instant-access' ? 'You’re a fit for instant beta access.' : result.outcome === 'guided-review' ? 'Your pilot needs a quick review.' : 'You’re on the platform waitlist.'}</h3>
        <p>{result.message}</p>
        {result.download && (
          <div className="beta-download-result">
            <a href={result.download.href} download>Download {result.download.label} <span>↓</span></a>
            <code title={result.download.sha256}>SHA-256 · {result.download.sha256}</code>
          </div>
        )}
        <small>We sent the same result to your email from beta@saasolution.es. Check spam if it does not arrive within a few minutes.</small>
      </div>
    );
  }

  return (
    <form className="beta-funnel" onSubmit={handleSubmit(submit)} noValidate>
      <div className="beta-funnel-progress" aria-label={`Step ${step + 1} of ${steps.length}`}>
        <div><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
        <ol>{steps.map((label, index) => <li key={label} className={index <= step ? 'active' : ''}><b>0{index + 1}</b>{label}</li>)}</ol>
      </div>

      <div className="beta-funnel-panel">
        {step === 0 && (
          <section>
            <p className="edge-kicker">Step 01 · About you</p>
            <h3>Who will run this beta?</h3>
            <p>We tailor the test plan differently for organizations and independent evaluators.</p>
            <ChoiceGroup name="applicationType" label="I am applying as" register={register} error={errors.applicationType} choices={[
              { value: 'business', label: 'A business or organization', detail: 'For an internal or customer-facing evaluation.' },
              { value: 'individual', label: 'An individual', detail: 'For a home lab, consulting, or technical evaluation.' },
            ]} />
            {applicationType === 'business' ? (
              <div className="beta-input-grid">
                <label><span>Organization name</span><input {...register('organizationName')} autoComplete="organization" placeholder="Company or organization" />{errors.organizationName && <small>{errors.organizationName.message}</small>}</label>
                <label><span>Your role</span><input {...register('role')} autoComplete="organization-title" placeholder="IT manager, founder, engineer…" />{errors.role && <small>{errors.role.message}</small>}</label>
                <label><span>Organization size</span><select {...register('organizationSize')} defaultValue=""><option value="" disabled>Select size</option><option value="solo">Solo business</option><option value="2-10">2–10 people</option><option value="11-50">11–50 people</option><option value="51-250">51–250 people</option><option value="251-plus">251+ people</option></select>{errors.organizationSize && <small>{errors.organizationSize.message}</small>}</label>
                <label><span>Country</span><input {...register('country')} autoComplete="country-name" placeholder="Country" />{errors.country && <small>{errors.country.message}</small>}</label>
              </div>
            ) : (
              <>
                <ChoiceGroup name="individualUse" label="What best describes your evaluation?" register={register} error={errors.individualUse} choices={[
                  { value: 'home-lab', label: 'Home lab' }, { value: 'consulting', label: 'Client consulting' }, { value: 'product-evaluation', label: 'Product evaluation' }, { value: 'other', label: 'Other' },
                ]} />
                <div className="beta-input-grid one"><label><span>Country</span><input {...register('country')} autoComplete="country-name" placeholder="Country" />{errors.country && <small>{errors.country.message}</small>}</label></div>
              </>
            )}
          </section>
        )}

        {step === 1 && (
          <section>
            <p className="edge-kicker">Step 02 · Your test</p>
            <h3>Tell us about the environment.</h3>
            <p>Your answers decide whether access can be instant or needs a guided review.</p>
            <ChoiceGroup name="platform" label="Primary test platform" register={register} error={errors.platform} choices={[
              { value: 'linux-amd64', label: 'Linux x86-64', detail: 'Intel or AMD 64-bit.' },
              { value: 'linux-arm64', label: 'Linux ARM64', detail: '64-bit ARM server or mini-PC.' },
              { value: 'raspberry-pi', label: 'Raspberry Pi OS 64-bit', detail: 'With reliable external storage.' },
              { value: 'other', label: 'Another platform', detail: 'Join the platform waitlist.' },
            ]} />
            {platform === 'other' && <div className="beta-input-grid one"><label><span>Which platform?</span><input {...register('otherPlatform')} placeholder="Synology, QNAP, TrueNAS, Windows…" />{errors.otherPlatform && <small>{errors.otherPlatform.message}</small>}</label></div>}
            <div className="beta-input-grid three">
              <label><span>Locations</span><select {...register('locations')} defaultValue=""><option value="" disabled>Select</option><option value="one">One location</option><option value="two">Two locations</option><option value="three-plus">Three or more</option></select>{errors.locations && <small>{errors.locations.message}</small>}</label>
              <label><span>Test data size</span><select {...register('dataSize')} defaultValue=""><option value="" disabled>Select</option><option value="under-100gb">Under 100 GB</option><option value="100gb-1tb">100 GB–1 TB</option><option value="over-1tb">Over 1 TB</option></select>{errors.dataSize && <small>{errors.dataSize.message}</small>}</label>
              <label><span>Start window</span><select {...register('startWindow')} defaultValue=""><option value="" disabled>Select</option><option value="now">Ready now</option><option value="within-30-days">Within 30 days</option><option value="researching">Researching</option></select>{errors.startWindow && <small>{errors.startWindow.message}</small>}</label>
            </div>
            <ChoiceGroup name="cubbitReadiness" label="Cubbit DS3 readiness" register={register} error={errors.cubbitReadiness} choices={[
              { value: 'ready', label: 'Already available' }, { value: 'can-create', label: 'I can create a test project' }, { value: 'not-ready', label: 'I need guidance first' },
            ]} />
            <ChoiceGroup name="linuxExperience" label="Linux administration experience" register={register} error={errors.linuxExperience} choices={[
              { value: 'comfortable', label: 'Comfortable' }, { value: 'with-guidance', label: 'Comfortable with guidance' }, { value: 'new-to-linux', label: 'New to Linux' },
            ]} />
          </section>
        )}

        {step === 2 && (
          <section>
            <p className="edge-kicker">Step 03 · Safety gate</p>
            <h3>Protect the original data first.</h3>
            <p>These confirmations are mandatory. Edge beta is synchronization software—not your only backup.</p>
            <div className="beta-safety-checks">
              <CheckField name="backupConfirmed" register={register} error={errors.backupConfirmed}>I will keep a verified, independent backup during the beta.</CheckField>
              <CheckField name="testScopeConfirmed" register={register} error={errors.testScopeConfirmed}>I will use test data or a controlled share, not the only copy of critical files.</CheckField>
              <CheckField name="operatorConfirmed" register={register} error={errors.operatorConfirmed}>A named technical operator will own installation, monitoring, and offboarding.</CheckField>
            </div>
            <div className="beta-safety-note"><ShieldCheck /><p><b>Why we ask.</b> The beta can preserve conflicts and pause abnormal changes, but it is not an immutable backup and has no production recovery SLA.</p></div>
          </section>
        )}

        {step === 3 && (
          <section>
            <p className="edge-kicker">Step 04 · Contact</p>
            <h3>Where should we send access?</h3>
            <p>Eligible applicants receive the download on screen and by email. Higher-risk pilots receive a review response.</p>
            <div className="beta-input-grid">
              <label><span>Full name</span><input {...register('fullName')} autoComplete="name" placeholder="Your name" />{errors.fullName && <small>{errors.fullName.message}</small>}</label>
              <label><span>Email address</span><input type="email" {...register('email')} autoComplete="email" placeholder="you@example.com" />{errors.email && <small>{errors.email.message}</small>}</label>
              <label><span>Phone or WhatsApp <i>Optional</i></span><input {...register('phone')} autoComplete="tel" placeholder="Include country code" />{errors.phone && <small>{errors.phone.message}</small>}</label>
              <label className="wide"><span>Anything we should know? <i>Optional</i></span><textarea {...register('notes')} rows={4} placeholder="Storage hardware, rollout goal, constraints…" />{errors.notes && <small>{errors.notes.message}</small>}</label>
            </div>
            <div className="beta-consents">
              <CheckField name="privacyAccepted" register={register} error={errors.privacyAccepted}>I agree that SaaSolution may process this application under the <Link href="/drive/privacy" target="_blank">privacy policy</Link>.</CheckField>
              <CheckField name="betaTermsAccepted" register={register} error={errors.betaTermsAccepted}>I accept the <Link href="/drive/terms" target="_blank">limited-beta conditions</Link>, including independent backup and best-effort support.</CheckField>
              <CheckField name="productUpdates" register={register}>Email me occasional Drive Edge product updates. Optional.</CheckField>
            </div>
            <label className="beta-honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" {...register('website')} /></label>
            <input type="hidden" {...register('startedAt', { valueAsNumber: true })} />
            {turnstileSiteKey && <TurnstileWidget onToken={setTurnstileToken} resetKey={turnstileReset} />}
            {submitError && <p className="beta-submit-error" role="alert">{submitError}</p>}
          </section>
        )}

        <div className="beta-funnel-actions">
          {step > 0 ? <button type="button" className="secondary" onClick={() => setStep((current) => current - 1)}><ArrowLeft /> Back</button> : <span />}
          {step < steps.length - 1 ? (
            <button type="button" className="primary" onClick={nextStep}>Continue <ArrowRight /></button>
          ) : (
            <button type="submit" className="primary" disabled={isSubmitting}>{isSubmitting ? <><LoaderCircle className="spin" /> Sending application…</> : <>Submit and get my result <ArrowRight /></>}</button>
          )}
        </div>
      </div>
    </form>
  );
}
