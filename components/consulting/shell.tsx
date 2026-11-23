import type { ReactNode } from 'react';
import Link from 'next/link';
import type { Lang } from '@/lib/health-check/questions';
import { absoluteUrl, pathFor, type PageKey, BASE_URL } from '@/lib/consulting/routes';
import { company, tr, type L } from '@/lib/consulting/content';
import { ui } from '@/lib/consulting/ui';
import { DriveLanguageSwitcher } from '@/app/i18n/language-provider';
import { PageViewTracker, TrackedLink } from './client-bits';

export type Crumb = { label: L; page?: PageKey };

function jsonLd(data: unknown) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export function ConsultingShell({ lang, page, crumbs, children, structured }: {
  lang: Lang;
  page: PageKey;
  crumbs: Crumb[];
  children: ReactNode;
  /** Extra JSON-LD nodes for this page. */
  structured?: unknown[];
}) {
  const trail = [{ label: ui.home, page: undefined as PageKey | undefined, url: `${BASE_URL}/` }, ...crumbs.map((c) => ({ ...c, url: c.page ? absoluteUrl(lang, c.page) : undefined }))];
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: tr(ui.home, lang), item: `${BASE_URL}/` },
      ...crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 2, name: tr(c.label, lang), item: absoluteUrl(lang, c.page ?? page) })),
    ],
  };
  const nav: { page: PageKey; label: L }[] = [
    { page: 'landing', label: ui.servicesNav },
    { page: 'public', label: { en: 'Public Sector', es: 'Sector Público' } },
    { page: 'private', label: { en: 'Businesses', es: 'Empresas' } },
    { page: 'healthcheck', label: { en: 'Health Check', es: 'Diagnóstico' } },
  ];

  return (
    <div className="cx" lang={lang === 'es' ? 'es' : undefined}>
      <a className="cx-skip" href="#main">{tr(ui.skip, lang)}</a>
      <header className="cx-header">
        <Link href="/" className="cx-brand" aria-label="SaaSolutions SL">SaaSolutions <sup>SL</sup></Link>
        <nav aria-label={tr(ui.mainNav, lang)} className="cx-nav">
          {nav.map((n) => <a key={n.page} href={pathFor(lang, n.page)} aria-current={n.page === page ? 'page' : undefined}>{tr(n.label, lang)}</a>)}
        </nav>
        <div className="cx-header-actions">
          <DriveLanguageSwitcher compact />
          <TrackedLink href={pathFor(lang, 'contact')} event="cta_click" props={{ cta: 'header_contact', location: 'header' }} className="cx-btn cx-btn-small">{tr(ui.ctaPrimary, lang)}</TrackedLink>
        </div>
      </header>

      <nav aria-label={tr(ui.breadcrumbs, lang)} className="cx-crumbs">
        <ol>
          {trail.map((c, i) => (
            <li key={i}>{i < trail.length - 1 && c.url ? <Link href={c.page ? pathFor(lang, c.page) : '/'}>{tr(c.label, lang)}</Link> : <span aria-current="page">{tr(c.label, lang)}</span>}</li>
          ))}
        </ol>
      </nav>

      <main id="main" tabIndex={-1}>{children}</main>

      <footer className="cx-footer">
        <p className="cx-footer-note">{tr(ui.footerNote, lang)}</p>
        <div className="cx-footer-row">
          <span>© 2026 {company.name} · {company.location}</span>
          <span className="cx-footer-links">
            <Link href="/privacy">{tr(ui.footerPrivacy, lang)}</Link>
            <Link href="/legal">{tr(ui.footerLegal, lang)}</Link>
            <Link href="/cookies">{tr(ui.footerCookies, lang)}</Link>
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </span>
        </div>
      </footer>

      {jsonLd(breadcrumbLd)}
      {structured?.map((node, i) => <span key={i}>{jsonLd(node)}</span>)}
      <PageViewTracker page={page} lang={lang} />
    </div>
  );
}
