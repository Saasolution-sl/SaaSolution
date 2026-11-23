import type { Lang } from '@/lib/health-check/questions';
import { pathFor } from '@/lib/consulting/routes';
import { landing, privatePathway, publicPathway, tr, trl } from '@/lib/consulting/content';
import { ui } from '@/lib/consulting/ui';
import { TrackedLink } from './client-bits';
import { AfterInquiry, Cta, CtaBand, Independence, Methodology, Section, ServiceCards } from './sections';

export function LandingPage({ lang }: { lang: Lang }) {
  return (
    <>
      <section className="cx-hero">
        <p className="cx-eyebrow">{tr(landing.eyebrow, lang)}</p>
        <h1>{tr(landing.heroTitle, lang)}</h1>
        <p className="cx-lead">{tr(landing.heroText, lang)}</p>
        <div className="cx-actions">
          <Cta lang={lang} location="hero" />
          <Cta lang={lang} page="healthcheck" location="hero-health" secondary />
        </div>
        <ul className="cx-pillars" aria-label={tr({ en: 'What we do', es: 'Qué hacemos' }, lang)}>
          {landing.pillars.map((p) => (
            <li key={p.name.en}><strong>{tr(p.name, lang)}</strong><span>{tr(p.text, lang)}</span></li>
          ))}
        </ul>
      </section>

      <Section title={tr(landing.problemsHeading, lang)} id="problems">
        <ul className="cx-cards cx-cards-plain">
          {landing.problems.map((p) => (
            <li key={p.q.en}>
              <h3>{tr(p.q, lang)}</h3>
              <TrackedLink href={pathFor(lang, p.page)} event="service_engaged" props={{ service: p.page, location: 'problem' }}>
                {tr(ui.ctaLearn, lang)} <span aria-hidden="true">→</span>
              </TrackedLink>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={tr(landing.servicesHeading, lang)} id="services" tone="soft">
        <ServiceCards lang={lang} location="landing" />
        <div className="cx-actions"><Cta lang={lang} location="after-services" /></div>
      </Section>

      <Section title={tr(landing.pathwaysHeading, lang)} id="pathways">
        <p className="cx-body">{tr(landing.pathwayLead, lang)}</p>
        <ul className="cx-cards cx-pathways">
          {[publicPathway, privatePathway].map((p) => (
            <li key={p.page}>
              <h3>{tr(p.name, lang)}</h3>
              <p>{tr(p.summary, lang)}</p>
              <ul className="cx-mini">{trl(p.audiences, lang).slice(0, 4).map((a) => <li key={a}>{a}</li>)}</ul>
              <TrackedLink href={pathFor(lang, p.page)} event="pathway_selected" props={{ pathway: p.page }} className="cx-btn cx-btn-secondary" aria-label={`${tr(ui.ctaLearn, lang)}: ${tr(p.name, lang)}`}>
                {tr(ui.ctaLearn, lang)}
              </TrackedLink>
            </li>
          ))}
        </ul>
      </Section>

      <Methodology lang={lang} />
      <Independence lang={lang} />

      <Section title={tr(landing.healthCheck.heading, lang)} id="health-check-promo">
        <p className="cx-body">{tr(landing.healthCheck.text, lang)}</p>
        <div className="cx-actions"><Cta lang={lang} page="healthcheck" location="promo" /></div>
      </Section>

      <Section title={tr(landing.trust.heading, lang)} id="trust" tone="soft">
        <ul className="cx-list cx-list-check">{trl(landing.trust.items, lang).map((i) => <li key={i}>{i}</li>)}</ul>
        <p className="cx-note">{tr(landing.trust.note, lang)}</p>
      </Section>

      <AfterInquiry lang={lang} />
      <CtaBand lang={lang} location="bottom" />
    </>
  );
}
