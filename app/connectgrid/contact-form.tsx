'use client';

import Link from 'next/link';
import { FormEvent } from 'react';
import styles from './page.module.css';

const contactEmail = 'hello@saasolution.es';

export function ConnectGridContactForm() {
  function prepareInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `ConnectGrid ${data.get('interest') ?? 'consultation'} — ${data.get('organization') ?? 'organization'}`;
    const body = [
      `Full name: ${data.get('fullName') ?? ''}`,
      `Organization: ${data.get('organization') ?? ''}`,
      `Country: ${data.get('country') ?? ''}`,
      `Business email: ${data.get('email') ?? ''}`,
      `Organization type: ${data.get('organizationType') ?? ''}`,
      `Interest: ${data.get('interest') ?? ''}`,
      '',
      'Integration needs or project description:',
      String(data.get('projectDescription') ?? ''),
    ].join('\n');

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className={styles.form} onSubmit={prepareInquiry}>
      <div className={styles.fieldGrid}>
        <Field label="Full name" name="fullName" placeholder="Your full name" />
        <Field label="Organization" name="organization" placeholder="Organization name" />
        <Field label="Country" name="country" placeholder="Country" />
        <Field label="Business email" name="email" placeholder="you@organization.com" type="email" />
      </div>
      <ChoiceGroup label="Organization type" name="organizationType" options={['Public Sector', 'Commercial']} />
      <label className={styles.field} htmlFor="connectgrid-project">
        <span>Integration needs or project description</span>
        <textarea id="connectgrid-project" name="projectDescription" placeholder="Which systems, workflows, or organizations need to connect?" required />
      </label>
      <ChoiceGroup label="Interest" name="interest" options={['Consultation', 'Pilot', 'Partnership']} />
      <label className={styles.consent}>
        <input name="consent" required type="checkbox" />
        <span>I agree that SaaSolution may use these details to respond to this inquiry. Read our <Link href="/privacy">privacy policy</Link>.</span>
      </label>
      <div className={styles.submitRow}>
        <p>Submitting opens a pre-filled email in your mail app. This page does not store your information.</p>
        <button type="submit">Prepare inquiry</button>
      </div>
      <a className={styles.emailFallback} href={`mailto:${contactEmail}`}>Or email {contactEmail} directly</a>
    </form>
  );
}

function Field({ label, name, placeholder, type = 'text' }: { label: string; name: string; placeholder: string; type?: string }) {
  const id = `connectgrid-${name}`;
  return <label className={styles.field} htmlFor={id}><span>{label}</span><input id={id} name={name} placeholder={placeholder} required type={type} /></label>;
}

function ChoiceGroup({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <fieldset className={styles.choices}>
      <legend>{label}</legend>
      <div>{options.map((option) => <label key={option}><input name={name} required type="radio" value={option} /><span>{option}</span></label>)}</div>
    </fieldset>
  );
}
