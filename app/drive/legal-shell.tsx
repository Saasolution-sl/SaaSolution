import type { ReactNode } from 'react';
import Image from 'next/image';
import { DriveLanguageSwitcher } from '../i18n/language-provider';

function LegalBrand() {
  return (
    <span className="legal-brand">
      <Image className="drive-app-icon" src="/windows-app-icon.png" alt="" width={34} height={34} aria-hidden="true" />
      <b>SaaSolution Drive</b>
    </span>
  );
}

export default function LegalShell({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <main className="legal-shell">
      <header className="legal-header">
        <a href="/drive"><LegalBrand /></a>
        <div className="legal-header-actions"><DriveLanguageSwitcher compact /><a href="/drive">Back to Drive <span>↗</span></a></div>
      </header>
      <article className="legal-document">
        <div className="legal-title">
          <p>App legal · SaaSolutions SL</p>
          <h1>{title}</h1>
          <div><span>{intro}</span><small>Last updated: 25 August 2026</small></div>
        </div>
        <aside className="legal-preview-note"><b>Release note</b><span>This document reflects the current product preview and must be reviewed against the final app, service providers and store configuration before release.</span></aside>
        <div className="legal-sections">{children}</div>
      </article>
      <footer className="legal-footer">
        <LegalBrand />
        <div><a href="/drive/privacy">Privacy Policy</a><a href="/drive/terms">Terms &amp; Conditions</a><a href="mailto:hello@saasolution.es">Contact</a></div>
        <small>© 2026 SaaSolutions SL · Ceuta, Spain</small>
      </footer>
    </main>
  );
}
