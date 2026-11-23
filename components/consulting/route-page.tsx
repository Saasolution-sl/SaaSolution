import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Lang } from '@/lib/health-check/questions';
import {
  absoluteUrl, alternateLanguages, allRouteParams, resolveRoute, BASE_URL, type PageKey,
} from '@/lib/consulting/routes';
import {
  company, landing, privatePathway, publicPathway, serviceByPage, tr, type L,
} from '@/lib/consulting/content';
import { ui } from '@/lib/consulting/ui';
import { ConsultingShell, type Crumb } from '@/components/consulting/shell';
import { LandingPage } from '@/components/consulting/landing';
import { AfterInquiry, PathwayDetail, ServiceDetail } from '@/components/consulting/sections';
import { HealthCheck } from '@/components/consulting/health-check';
import { ConsultationForm } from '@/components/consulting/consultation-form';
import { BookingCard } from '@/components/consulting/booking';

type Params = { path: string[] };

/** Static params for one language folder (app/en, app/es). */
export function paramsForLang(lang: Lang) {
  return allRouteParams().filter((p) => p.lang === lang).map(({ path }) => ({ path }));
}

function metaFor(key: PageKey): { title: L; description: L } {
  if (key === 'landing') return { title: landing.metaTitle, description: landing.metaDescription };
  if (key === 'public') return { title: publicPathway.metaTitle, description: publicPathway.metaDescription };
  if (key === 'private') return { title: privatePathway.metaTitle, description: privatePathway.metaDescription };
  if (key === 'healthcheck') return { title: ui.hc.title, description: ui.hc.metaDescription };
  if (key === 'contact') return {
    title: { en: 'Request a Consultation', es: 'Solicitar una Consulta' },
    description: {
      en: 'Request an initial conversation with SaaSolution about IT consultancy, independent IT auditing, project oversight or public tender technical advisory.',
      es: 'Solicite una primera conversación con SaaSolution sobre consultoría informática, auditoría informática independiente, supervisión de proyectos o asesoramiento técnico en licitaciones.',
    },
  };
  const s = serviceByPage(key)!;
  return { title: s.metaTitle, description: s.metaDescription };
}

export async function metadataForLang(lang: Lang, params: Promise<Params>): Promise<Metadata> {
  const { path } = await params;
  const route = resolveRoute(lang, path);
  if (!route) return {};
  const { title, description } = metaFor(route.key);
  const url = absoluteUrl(route.lang, route.key);
  const fullTitle = `${tr(title, route.lang)} | SaaSolution`;
  return {
    title: fullTitle,
    description: tr(description, route.lang),
    alternates: { canonical: url, languages: alternateLanguages(route.key) },
    openGraph: {
      type: 'website',
      url,
      siteName: 'SaaSolution',
      title: fullTitle,
      description: tr(description, route.lang),
      locale: route.lang === 'es' ? 'es_ES' : 'en_GB',
      alternateLocale: route.lang === 'es' ? ['en_GB'] : ['es_ES'],
      images: [{ url: `${BASE_URL}/og.png` }],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description: tr(description, route.lang) },
  };
}

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.name,
  url: BASE_URL,
  email: company.email,
  address: { '@type': 'PostalAddress', addressLocality: 'Ceuta', addressCountry: 'ES' },
};

export async function ConsultingRoute({ lang: rawLang, params }: { lang: Lang; params: Promise<Params> }) {
  const { path } = await params;
  const route = resolveRoute(rawLang, path);
  if (!route) notFound();
  const { lang, key } = route;

  const landingCrumb: Crumb = { label: ui.navLabel, page: 'landing' };
  const crumbs: Crumb[] = key === 'landing' ? [landingCrumb] : [landingCrumb, { label: metaFor(key).title, page: key }];
  // Short breadcrumb labels for deep pages
  const service = serviceByPage(key);
  const names: Partial<Record<PageKey, L>> = {
    public: publicPathway.name, private: privatePathway.name, healthcheck: ui.hc.title,
    contact: { en: 'Request a Consultation', es: 'Solicitar una Consulta' },
  };
  if (key !== 'landing') crumbs[1] = { label: service?.name ?? names[key]!, page: key };

  const structured: unknown[] = [];
  if (key === 'landing') structured.push(organizationLd);
  if (service) {
    structured.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: tr(service.name, lang),
      description: tr(service.summary, lang),
      url: absoluteUrl(lang, key),
      inLanguage: lang,
      provider: { '@type': 'Organization', name: company.name, url: BASE_URL },
      areaServed: [{ '@type': 'Country', name: 'Spain' }],
    });
  }

  return (
    <ConsultingShell lang={lang as Lang} page={key} crumbs={crumbs} structured={structured}>
      <Body lang={lang} pageKey={key} />
    </ConsultingShell>
  );
}

function Body({ lang, pageKey }: { lang: Lang; pageKey: PageKey }) {
  if (pageKey === 'landing') return <LandingPage lang={lang} />;
  if (pageKey === 'public') return <PathwayDetail lang={lang} pathway={publicPathway} />;
  if (pageKey === 'private') return <PathwayDetail lang={lang} pathway={privatePathway} />;
  if (pageKey === 'healthcheck') {
    return (
      <section className="cx-hero cx-hero-compact">
        <p className="cx-eyebrow">{tr(ui.navLabel, lang)}</p>
        <h1>{tr(ui.hc.title, lang)}</h1>
        <HealthCheck lang={lang} />
      </section>
    );
  }
  if (pageKey === 'contact') {
    return (
      <>
        <section className="cx-hero cx-hero-compact">
          <p className="cx-eyebrow">{tr(ui.navLabel, lang)}</p>
          <h1>{tr(ui.form.title, lang)}</h1>
          <p className="cx-lead">{tr(ui.form.intro, lang)}</p>
          <ConsultationForm lang={lang} headless />
        </section>
        <BookingCard lang={lang} />
        <AfterInquiry lang={lang} />
      </>
    );
  }
  const service = serviceByPage(pageKey)!;
  return <ServiceDetail lang={lang} service={service} />;
}
