import type { Lang } from '@/lib/health-check/questions';
import { pathFor, type PageKey } from '@/lib/consulting/routes';
import {
  afterInquiry, independence, methodology, methodologyNote, services, tr, trl,
  type L, type LL, type Pathway, type ServiceContent,
} from '@/lib/consulting/content';
import { ui } from '@/lib/consulting/ui';
import { TrackedLink } from './client-bits';

export function Cta({ lang, page = 'contact', label, location, secondary, className }: {
  lang: Lang; page?: PageKey; label?: L; location: string; secondary?: boolean; className?: string;
}) {
  return (
    <TrackedLink
      href={pathFor(lang, page)}
      event="cta_click"
      props={{ cta: page, location }}
      className={`cx-btn${secondary ? ' cx-btn-secondary' : ''}${className ? ` ${className}` : ''}`}
    >
      {tr(label ?? (page === 'healthcheck' ? ui.ctaHealth : ui.ctaPrimary), lang)}
    </TrackedLink>
  );
}

export function CtaBand({ lang, heading, text, label, location, page = 'contact', withHealth = true }: {
  lang: Lang; heading?: L; text?: L; label?: L; location: string; page?: PageKey; withHealth?: boolean;
}) {
  return (
    <section className="cx-band" aria-labelledby={`band-${location}`}>
      <h2 id={`band-${location}`}>{tr(heading ?? ui.contactHeading, lang)}</h2>
      <p>{tr(text ?? ui.contactText, lang)}</p>
      <div className="cx-actions">
        <Cta lang={lang} page={page} label={label} location={location} />
        {withHealth && <Cta lang={lang} page="healthcheck" location={`${location}-health`} secondary />}
      </div>
      <p className="cx-note cx-band-book"><TrackedLink href={`${pathFor(lang, 'contact')}#booking`} event="booking_click" props={{ location }}>{tr(ui.booking.link, lang)} →</TrackedLink></p>
    </section>
  );
}

export function BulletList({ items, lang }: { items: LL; lang: Lang }) {
  return <ul className="cx-list">{trl(items, lang).map((i) => <li key={i}>{i}</li>)}</ul>;
}

export function Section({ title, id, children, tone }: { title: string; id?: string; children: React.ReactNode; tone?: 'soft' }) {
  return (
    <section className={`cx-section${tone ? ` cx-${tone}` : ''}`} aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {children}
    </section>
  );
}

export function ServiceCards({ lang, only, location }: { lang: Lang; only?: ServiceContent['key'][]; location: string }) {
  const list = only ? only.map((k) => services.find((s) => s.key === k)!).filter(Boolean) : services;
  return (
    <ul className="cx-cards">
      {list.map((s) => (
        <li key={s.key}>
          <h3>{tr(s.name, lang)}</h3>
          <p>{tr(s.summary, lang)}</p>
          <TrackedLink href={pathFor(lang, s.page)} event="service_engaged" props={{ service: s.key, location }} aria-label={`${tr(ui.ctaLearn, lang)}: ${tr(s.name, lang)}`}>
            {tr(ui.ctaLearn, lang)} <span aria-hidden="true">→</span>
          </TrackedLink>
        </li>
      ))}
    </ul>
  );
}

export function Methodology({ lang }: { lang: Lang }) {
  return (
    <Section title={tr(ui.methodology, lang)} id="method" tone="soft">
      <ol className="cx-steps">
        {methodology.map((m, i) => (
          <li key={i}>
            <span className="cx-step-n" aria-hidden="true">{i + 1}</span>
            <h3>{tr(m.name, lang)}</h3>
            <p>{tr(m.text, lang)}</p>
          </li>
        ))}
      </ol>
      <p className="cx-note">{tr(methodologyNote, lang)}</p>
    </Section>
  );
}

export function Independence({ lang }: { lang: Lang }) {
  return (
    <section className="cx-independence" aria-labelledby="independence">
      <h2 id="independence">{tr(independence.heading, lang)}</h2>
      <p>{tr(independence.intro, lang)}</p>
      <ul className="cx-list cx-list-check">{trl(independence.points, lang).map((p) => <li key={p}>{p}</li>)}</ul>
    </section>
  );
}

export function AfterInquiry({ lang }: { lang: Lang }) {
  return (
    <Section title={tr(afterInquiry.heading, lang)} id="after-inquiry">
      <ol className="cx-numbered">{trl(afterInquiry.steps, lang).map((s) => <li key={s}>{s}</li>)}</ol>
      <p className="cx-note">{tr(afterInquiry.note, lang)}</p>
    </Section>
  );
}

export function ServiceDetail({ lang, service }: { lang: Lang; service: ServiceContent }) {
  const related = services.filter((s) => s.key !== service.key).slice(0, 3);
  return (
    <>
      <section className="cx-hero cx-hero-compact">
        <p className="cx-eyebrow">{tr(ui.navLabel, lang)}</p>
        <h1>{tr(service.name, lang)}</h1>
        <p className="cx-question">{tr(service.recognition, lang)}</p>
        <p className="cx-lead">{tr(service.relevance, lang)}</p>
        <div className="cx-actions">
          <Cta lang={lang} label={service.cta} location="hero" />
          <Cta lang={lang} page="healthcheck" location="hero-health" secondary />
        </div>
      </section>

      <Section title={tr(ui.problems, lang)} id="problems"><BulletList items={service.problems} lang={lang} /></Section>
      <Section title={tr(ui.capabilities, lang)} id="capabilities" tone="soft">
        <ul className="cx-chips">{trl(service.capabilities, lang).map((c) => <li key={c}>{c}</li>)}</ul>
        <div className="cx-actions"><Cta lang={lang} label={service.cta} location="after-capabilities" /></div>
      </Section>
      <Section title={tr(ui.engagement, lang)} id="engagement">
        <ol className="cx-numbered">{trl(service.engagement, lang).map((s) => <li key={s}>{s}</li>)}</ol>
      </Section>
      <Section title={tr(ui.deliverables, lang)} id="deliverables" tone="soft"><BulletList items={service.deliverables} lang={lang} /></Section>
      <Section title={tr(ui.boundaries, lang)} id="boundaries"><BulletList items={service.boundaries} lang={lang} /></Section>
      <Methodology lang={lang} />
      <Independence lang={lang} />
      <AfterInquiry lang={lang} />
      <Section title={tr(ui.relatedServices, lang)} id="related">
        <ul className="cx-cards">
          {related.map((s) => (
            <li key={s.key}>
              <h3>{tr(s.name, lang)}</h3>
              <p>{tr(s.summary, lang)}</p>
              <TrackedLink href={pathFor(lang, s.page)} event="service_engaged" props={{ service: s.key, location: 'related' }} aria-label={`${tr(ui.ctaLearn, lang)}: ${tr(s.name, lang)}`}>{tr(ui.ctaLearn, lang)} <span aria-hidden="true">→</span></TrackedLink>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand lang={lang} location="bottom" label={service.cta} />
    </>
  );
}

export function PathwayDetail({ lang, pathway }: { lang: Lang; pathway: Pathway }) {
  const isPublic = pathway.page === 'public';
  return (
    <>
      <section className="cx-hero cx-hero-compact">
        <p className="cx-eyebrow">{tr(pathway.name, lang)}</p>
        <h1>{tr(pathway.heroTitle, lang)}</h1>
        <p className="cx-lead">{tr(pathway.heroText, lang)}</p>
        <ul className="cx-questions">{trl(pathway.recognition, lang).map((q) => <li key={q}>{q}</li>)}</ul>
        <div className="cx-actions">
          <Cta lang={lang} label={pathway.cta} location="hero" />
          <Cta lang={lang} page="healthcheck" location="hero-health" secondary />
        </div>
      </section>

      <Section title={tr(ui.audiences, lang)} id="audiences">
        <ul className="cx-chips">{trl(pathway.audiences, lang).map((a) => <li key={a}>{a}</li>)}</ul>
      </Section>

      <Section title={tr(ui.priorities, lang)} id="priorities" tone="soft">
        <ul className="cx-cards cx-cards-plain">
          {pathway.emphasis.map((e) => <li key={e.title.en}><h3>{tr(e.title, lang)}</h3><p>{tr(e.text, lang)}</p></li>)}
        </ul>
      </Section>

      {pathway.extra && (
        <Section title={tr(pathway.extra.heading, lang)} id="local">
          {trl(pathway.extra.paragraphs, lang).map((p) => <p key={p} className="cx-body">{p}</p>)}
          {pathway.extra.note && <p className="cx-note">{tr(pathway.extra.note, lang)}</p>}
        </Section>
      )}

      <Section title={tr(ui.servicesNav, lang)} id="services" tone={pathway.extra ? 'soft' : undefined}>
        <ServiceCards lang={lang} only={pathway.relevantServices} location={isPublic ? 'public-pathway' : 'private-pathway'} />
        <div className="cx-actions"><Cta lang={lang} label={pathway.cta} location="after-services" /></div>
      </Section>

      <Methodology lang={lang} />
      <Independence lang={lang} />
      <AfterInquiry lang={lang} />
      <CtaBand lang={lang} location="bottom" label={pathway.cta} />
    </>
  );
}

