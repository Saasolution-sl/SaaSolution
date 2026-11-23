import type { Lang } from '../health-check/questions.ts';

/**
 * Route map for the Consulting & Auditing division.
 * Every page exists in both languages under a language-prefixed URL so each
 * language has its own indexable URL and correct hreflang alternates.
 */
export const pageKeys = [
  'landing', 'consultancy', 'audit', 'tender', 'oversight', 'ai', 'public', 'private', 'healthcheck', 'contact',
] as const;
export type PageKey = (typeof pageKeys)[number];

export const BASE_URL = 'https://saasolution.es';

const slugs: Record<Lang, Record<PageKey, string>> = {
  en: {
    landing: 'consulting-auditing',
    consultancy: 'consulting-auditing/it-consultancy-digital-transformation',
    audit: 'consulting-auditing/independent-it-auditing',
    tender: 'consulting-auditing/public-tender-procurement-advisory',
    oversight: 'consulting-auditing/project-oversight-quality-assurance',
    ai: 'consulting-auditing/ai-automation-systems-integration',
    public: 'consulting-auditing/public-sector-institutional-services',
    private: 'consulting-auditing/private-business-consultancy',
    healthcheck: 'consulting-auditing/technology-project-health-check',
    contact: 'consulting-auditing/request-consultation',
  },
  es: {
    landing: 'consultoria-auditoria',
    consultancy: 'consultoria-auditoria/consultoria-tecnologica-transformacion-digital',
    audit: 'consultoria-auditoria/auditoria-informatica-independiente',
    tender: 'consultoria-auditoria/asesoramiento-tecnico-licitaciones-contratacion-publica',
    oversight: 'consultoria-auditoria/supervision-proyectos-aseguramiento-calidad',
    ai: 'consultoria-auditoria/inteligencia-artificial-automatizacion-integracion',
    public: 'consultoria-auditoria/servicios-sector-publico-instituciones',
    private: 'consultoria-auditoria/consultoria-tecnologica-empresas',
    healthcheck: 'consultoria-auditoria/diagnostico-inicial-salud-tecnologica',
    contact: 'consultoria-auditoria/solicitar-consulta',
  },
};

export const pathFor = (lang: Lang, key: PageKey) => `/${lang}/${slugs[lang][key]}`;
export const absoluteUrl = (lang: Lang, key: PageKey) => `${BASE_URL}${pathFor(lang, key)}`;
export const langs: Lang[] = ['en', 'es'];

/** All static params for the [lang]/[...path] route. */
export function allRouteParams() {
  return langs.flatMap((lang) => pageKeys.map((key) => ({ lang, path: slugs[lang][key].split('/') })));
}

export function resolveRoute(lang: string, path: string[]): { lang: Lang; key: PageKey } | null {
  if (lang !== 'en' && lang !== 'es') return null;
  const joined = path.join('/');
  const key = pageKeys.find((k) => slugs[lang][k] === joined);
  return key ? { lang, key } : null;
}

/** Equivalent page in another language for a /en or /es pathname, or null if not a consulting page. */
export function equivalentPath(pathname: string, target: Lang): string | null {
  const [, lang, ...rest] = pathname.replace(/\/+$/, '').split('/');
  const route = resolveRoute(lang, rest);
  return route ? pathFor(target, route.key) : null;
}

export const alternateLanguages = (key: PageKey) => ({
  en: absoluteUrl('en', key),
  es: absoluteUrl('es', key),
  'x-default': absoluteUrl('en', key),
});
