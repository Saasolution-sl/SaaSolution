'use client';

import { useEffect, type ReactNode } from 'react';
import { track, type AnalyticsEvent } from '@/lib/consulting/analytics';
import { pathFor, type PageKey } from '@/lib/consulting/routes';
import { useSiteLocale } from '@/app/i18n/language-provider';
import { homeSection, tr, type L } from '@/lib/consulting/content';

/** Fires consulting_page_view once per page load. */
export function PageViewTracker({ page, lang }: { page: string; lang: string }) {
  useEffect(() => { track('consulting_page_view', { page, lang }); }, [page, lang]);
  return null;
}

/** Anchor that reports a conversion event on click. Plain <a> to match the site's navigation. */
export function TrackedLink({ href, event, props, className, children, ...rest }: {
  href: string;
  event: AnalyticsEvent;
  props?: Record<string, string | number | boolean>;
  className?: string;
  children: ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'>) {
  return <a href={href} className={className} onClick={() => track(event, props)} {...rest}>{children}</a>;
}

/**
 * Link to a consulting page that follows the visitor's chosen language
 * (Spanish → /es, everything else → /en). Used from the homepage, whose
 * language is chosen client-side.
 */
export function ConsultingLink({ page, label, className, event }: { page: PageKey; label: L; className?: string; event?: AnalyticsEvent }) {
  const { locale } = useSiteLocale();
  const lang = locale === 'es' ? 'es' : 'en';
  return (
    <a href={pathFor(lang, page)} className={className} lang={locale} data-i18n-skip onClick={event ? () => track(event, { page }) : undefined}>
      {tr(label, locale)}
    </a>
  );
}

/**
 * Homepage "Beyond Software Development" section. Fully bilingual (en/es) and
 * excluded from the DOM translator; other site languages fall back to English.
 */
export function HomeConsultingSection() {
  const { locale } = useSiteLocale();
  const lang = locale === 'es' ? 'es' : 'en';
  return (
    <section className="cx-home" id="consulting" lang={locale} data-i18n-skip aria-labelledby="cx-home-title">
      <div className="cx-home-inner">
        <p className="cx-eyebrow">{tr(homeSection.eyebrow, locale)}</p>
        <h2 id="cx-home-title">{tr(homeSection.heading, locale)}</h2>
        <p className="cx-home-text">{tr(homeSection.text, locale)}</p>
        <ul className="cx-home-links">
          {homeSection.links.map((link) => (
            <li key={link.page}>
              <a href={pathFor(lang, link.page)} onClick={() => track('cta_click', { cta: link.page, location: 'home' })}>
                <span>{tr(link.label, locale)}</span><i aria-hidden="true">↗</i>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
