import type { SitePage } from './pages-content';
import { DriveLanguageSwitcher } from '../../app/i18n/language-provider';

const footerLinks: [string, string][] = [
  ['Privacy', '/privacy'],
  ['Terms', '/terms'],
  ['Cookies', '/cookies'],
  ['Legal notice', '/legal'],
  ['Contact', 'mailto:hello@saasolution.es'],
];

export default function SiteShell({ page }: { page: SitePage }) {
  return (
    <main className="legal-shell">
      <header className="legal-header">
        <a href="/" className="legal-brand"><b>SaaSolutions <sup>SL</sup></b></a>
        <div className="legal-header-actions"><DriveLanguageSwitcher compact /><a href="/#footer">Back to home <span>↗</span></a></div>
      </header>
      <article className="legal-document">
        <div className="legal-title">
          <p>{page.eyebrow} · SaaSolutions SL{page.status ? ` · ${page.status}` : ''}</p>
          <h1>{page.title}</h1>
          <div><span>{page.intro}</span>{page.updated ? <small>Last updated: {page.updated}</small> : <small />}</div>
        </div>
        <div className="legal-sections">
          {page.sections.map((s, i) => (
            <section key={s.title}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2>{s.title}</h2>
                {s.paragraphs.map((p) => <p key={p}>{p}</p>)}
                {s.list && <ul>{s.list.map((l) => <li key={l}>{l}</li>)}</ul>}
              </div>
            </section>
          ))}
        </div>
        {page.cta && (
          <p style={{ marginTop: 48 }}>
            <a href={page.cta.href} style={{ display: 'inline-block', padding: '14px 22px', borderRadius: 99, background: 'var(--deep)', color: 'white', fontWeight: 900, fontSize: 13 }}>{page.cta.label} ↗</a>
          </p>
        )}
      </article>
      <footer className="legal-footer">
        <span className="legal-brand"><b>SaaSolutions SL</b></span>
        <div>{footerLinks.map(([l, h]) => <a key={l} href={h}>{l}</a>)}</div>
        <small>© 2026 SaaSolutions SL · Ceuta, Spain</small>
      </footer>
    </main>
  );
}
