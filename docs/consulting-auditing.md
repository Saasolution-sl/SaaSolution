# Consulting & Auditing division — maintenance notes

## Routes (static, `/en/*` and `/es/*`, each with its own canonical + hreflang)

| Page | EN | ES |
|---|---|---|
| Landing | `/en/consulting-auditing` | `/es/consultoria-auditoria` |
| IT Consultancy | `…/it-consultancy-digital-transformation` | `…/consultoria-tecnologica-transformacion-digital` |
| Independent IT Auditing | `…/independent-it-auditing` | `…/auditoria-informatica-independiente` |
| Tender & Procurement | `…/public-tender-procurement-advisory` | `…/asesoramiento-tecnico-licitaciones-contratacion-publica` |
| Oversight & QA | `…/project-oversight-quality-assurance` | `…/supervision-proyectos-aseguramiento-calidad` |
| AI & Automation | `…/ai-automation-systems-integration` | `…/inteligencia-artificial-automatizacion-integracion` |
| Public Sector | `…/public-sector-institutional-services` | `…/servicios-sector-publico-instituciones` |
| Private Business | `…/private-business-consultancy` | `…/consultoria-tecnologica-empresas` |
| Health Check | `…/technology-project-health-check` | `…/diagnostico-inicial-salud-tecnologica` |
| Request consultation | `…/request-consultation` | `…/solicitar-consulta` |

(Sub-pages are nested under the landing slug.) The route table lives in `lib/consulting/routes.ts`; the sitemap and
hreflang alternates are generated from it. Because the site's own language switcher is client-side (DOM translation),
these pages are authored natively in EN/ES; the URL language wins over the saved preference (see `app/i18n/language-provider.tsx`).
Other site languages fall back to English on these pages.

## Where things are

- Content (all copy, en/es): `lib/consulting/content.ts`, UI strings: `lib/consulting/ui.ts`
- Health Check questions: `lib/health-check/questions.ts`; scoring: `lib/health-check/scoring.ts`; tests: `scoring.test.ts`
- Components: `components/consulting/*`; route entry: `components/consulting/route-page.tsx` (+ `app/en`, `app/es`)
- Consultation API: `app/api/consultation/route.ts`; shared schema: `lib/consultation.ts`

## Health Check scoring (see header comment in `scoring.ts`)

Full = 100, partial = 50, none = 0. "Not sure" and "Not applicable" are excluded; "not sure" is reported as uncertainty.
Category score = mean of known answers (min 2). Overall = unweighted mean of scored categories (min 3 categories and 8 known
answers), otherwise "Insufficient information". Labels: ≥75 Strong Foundations, 50–74 Developing, <50 Needs Attention.
Answers never leave the browser; only an optional, opt-in summary (scores + gap statements) is attached to an inquiry.

## Analytics events (`lib/consulting/analytics.ts`)

No analytics service is installed. `track()` dispatches a `saasolution:analytics` DOM event and pushes to `window.dataLayer`
only if one already exists. No identifiers, no personal data, nothing sent over the network.

`consulting_page_view`, `pathway_selected`, `service_engaged`, `cta_click`, `health_check_start`, `health_check_complete`,
`results_to_contact_click`, `consultation_form_start`, `consultation_submitted`.

## Configuration required (see `.env.example`)

`CONSULTATION_SMTP_HOST`, `CONSULTATION_SMTP_PORT`, `CONSULTATION_SMTP_USER`, `CONSULTATION_SMTP_PASSWORD`,
`CONSULTATION_FROM_EMAIL`; optional `CONSULTATION_TO_EMAIL` (defaults to the published `hello@saasolution.es`).
Without them the API returns a safe 503 and the form shows an error with the contact email.

## Commands

`npm test` (scoring unit tests, Node's built-in runner) · `npm run typecheck` · `npm run lint` · `npm run build`
