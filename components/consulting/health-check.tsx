'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  answerOptions, audienceOptions, categories, questions,
  type Audience, type AnswerValue, type Lang,
} from '@/lib/health-check/questions';
import { buildSummary, computeResults, visibleCategories, visibleQuestions, type Answers } from '@/lib/health-check/scoring';
import { pathFor } from '@/lib/consulting/routes';
import { services, tr, trl, type SiteLocale } from '@/lib/consulting/content';
import { fmt, ui } from '@/lib/consulting/ui';
import { track } from '@/lib/consulting/analytics';
import { useSiteLocale } from '@/app/i18n/language-provider';
import { ConsultationForm } from './consultation-form';

type Phase = 'intro' | 'steps' | 'results';
const hc = ui.hc;

export function HealthCheck({ lang }: { lang: Lang }) {
  const { locale } = useSiteLocale();
  // Spanish pages are always Spanish; English pages show English or the visitor's chosen language.
  const tl: SiteLocale = lang === 'es' ? 'es' : locale;
  const [phase, setPhase] = useState<Phase>('intro');
  const [audience, setAudience] = useState<Audience | null>(null);
  const [aiInterest, setAiInterest] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const profile = useMemo(() => ({ audience, aiInterest }), [audience, aiInterest]);
  const cats = useMemo(() => visibleCategories(profile), [profile]);
  // steps: 0 = about you, 1..n = categories, n+1 = review
  const total = cats.length + 2;
  const results = useMemo(() => computeResults(profile, answers), [profile, answers]);

  useEffect(() => { headingRef.current?.focus({ preventScroll: false }); }, [phase, step]);
  useEffect(() => { if (showForm) formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [showForm]);

  const catTitle = (id: string) => tr(categories.find((c) => c.id === id)!.title, tl);
  const answerLabel = (v?: AnswerValue) => (v ? tr(answerOptions.find((o) => o.value === v)!.label, tl) : tr(hc.unanswered, tl));
  const setAnswer = (id: string, value: AnswerValue | undefined) =>
    setAnswers((prev) => {
      const next = { ...prev };
      if (value) next[id] = value; else delete next[id];
      return next;
    });

  function restart() {
    setPhase('intro'); setStep(0); setAnswers({}); setAudience(null); setAiInterest(false); setShowForm(false);
  }

  /* ----------------------------- intro ----------------------------- */
  if (phase === 'intro') {
    return (
      <div className="cx-hc" data-i18n-skip>
        <h2 ref={headingRef} tabIndex={-1}>{tr(hc.title, tl)}</h2>
        <p className="cx-lead">{tr(hc.intro, tl)}</p>
        <p className="cx-note">{tr(hc.disclaimer, tl)}</p>
        <p className="cx-note">{tr(hc.privacyNote, tl)}</p>
        <button type="button" className="cx-btn" onClick={() => { track('health_check_start'); setPhase('steps'); setStep(0); }}>
          {tr(hc.start, tl)}
        </button>
      </div>
    );
  }

  /* ---------------------------- results ---------------------------- */
  if (phase === 'results') {
    const summary = buildSummary(profile, results, lang);
    const label = tr(hc.labels[results.overallLabel], tl);
    return (
      <div className="cx-hc" data-i18n-skip>
        <h2 ref={headingRef} tabIndex={-1}>{tr(hc.resultsTitle, tl)}</h2>
        <p className="cx-note">{tr(hc.disclaimer, tl)}</p>

        <section className="cx-result-overall" aria-labelledby="r-overall">
          <h3 id="r-overall">{tr(hc.overall, tl)}</h3>
          {results.overallScore === null ? (
            <>
              <p className="cx-score-label">{tr(hc.insufficient, tl)}</p>
              <p>{tr(hc.insufficientText, tl)}</p>
            </>
          ) : (
            <>
              <p className="cx-score"><span>{results.overallScore}</span><small> / 100 · {label}</small></p>
              <p className="cx-note">{tr(hc.highScoreCaution, tl)}</p>
            </>
          )}
        </section>

        <section aria-labelledby="r-cats">
          <h3 id="r-cats">{tr(hc.byCategory, tl)}</h3>
          <ul className="cx-bars" aria-label={tr(hc.chartLabel, tl)}>
            {results.categories.map((c) => (
              <li key={c.id}>
                <div className="cx-bar-head">
                  <span>{catTitle(c.id)}</span>
                  <strong>{c.score === null ? tr(hc.insufficient, tl) : `${c.score} / 100 · ${tr(hc.labels[c.label], tl)}`}</strong>
                </div>
                <div className="cx-bar" aria-hidden="true"><i className={`cx-bar-${c.label}`} style={{ width: `${c.score ?? 0}%` }} /></div>
                <small>{fmt(tr(hc.answered, tl), { k: c.known, t: c.total })}</small>
              </li>
            ))}
          </ul>
        </section>

        <div className="cx-two">
          <section aria-labelledby="r-strengths">
            <h3 id="r-strengths">{tr(hc.strengths, tl)}</h3>
            {results.strengths.length
              ? <ul className="cx-list cx-list-check">{results.strengths.map((id) => <li key={id}>{catTitle(id)}</li>)}</ul>
              : <p>{tr(hc.noStrengths, tl)}</p>}
          </section>
          <section aria-labelledby="r-improve">
            <h3 id="r-improve">{tr(hc.improvements, tl)}</h3>
            {results.improvementAreas.length ? (
              <ul className="cx-list">
                {results.improvementAreas.map((a) => (
                  <li key={a.category}>
                    <strong>{catTitle(a.category)}</strong>
                    <ul>{a.questions.map((q) => <li key={q}>{tr(questions.find((x) => x.id === q)!.gap, tl)}</li>)}</ul>
                  </li>
                ))}
              </ul>
            ) : <p>{tr(hc.noImprovements, tl)}</p>}
          </section>
        </div>

        {results.uncertain.length > 0 && (
          <section aria-labelledby="r-unsure">
            <h3 id="r-unsure">{tr(hc.uncertainties, tl)}</h3>
            <p className="cx-note">{tr(hc.uncertaintyNote, tl)}</p>
            <ul className="cx-list">
              {results.uncertain.map((u) => (
                <li key={u.category}>
                  {catTitle(u.category)}
                  {u.unsure > 0 && <> · {fmt(tr(hc.unsureCount, tl), { n: u.unsure })}</>}
                  {u.unanswered > 0 && <> · {fmt(tr(hc.skippedCount, tl), { n: u.unanswered })}</>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="r-recs">
          <h3 id="r-recs">{tr(hc.recommendations, tl)}</h3>
          {results.recommendations.length ? (
            <ol className="cx-recs">
              {results.recommendations.map((r) => {
                const svc = services.find((s) => s.key === r.service)!;
                return (
                  <li key={r.service}>
                    <h4>{tr(svc.name, tl)}</h4>
                    <p>{tr(svc.summary, tl)}</p>
                    <p className="cx-because"><strong>{tr(hc.because, tl)}</strong> {r.drivers.map((d) => tr(questions.find((q) => q.id === d)!.gap, tl)).join('; ')}.</p>
                    <a href={pathFor(lang, svc.page)} onClick={() => track('service_engaged', { service: svc.key, location: 'health-check' })}>
                      {tr(hc.serviceCta, tl)} <span aria-hidden="true">→</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          ) : <p>{tr(hc.noRecommendations, tl)}</p>}
        </section>

        <section className="cx-band" aria-labelledby="r-cta">
          <h3 id="r-cta">{tr(hc.ctaHeading, tl)}</h3>
          <p>{tr(hc.ctaText, tl)}</p>
          <div className="cx-actions">
            <button type="button" className="cx-btn" onClick={() => { track('results_to_contact_click'); setShowForm(true); }} aria-expanded={showForm}>
              {tr(hc.ctaButton, tl)}
            </button>
            <button type="button" className="cx-btn cx-btn-secondary" onClick={restart}>{tr(hc.restart, tl)}</button>
          </div>
        </section>

        {showForm && (
          <div ref={formRef}>
            <ConsultationForm
              lang={lang}
              summary={summary}
              defaultService="healthcheck"
              defaultOrgType={audience ?? undefined}
            />
          </div>
        )}

        <details className="cx-privacy">
          <summary>{tr(hc.methodSummary, tl)}</summary>
          <ul className="cx-list">{trl(hc.method, tl).map((m) => <li key={m}>{m}</li>)}</ul>
        </details>
      </div>
    );
  }

  /* ----------------------------- steps ----------------------------- */
  const isAbout = step === 0;
  const isReview = step === total - 1;
  const cat = !isAbout && !isReview ? cats[step - 1] : null;
  const stepQuestions = cat ? visibleQuestions(profile).filter((q) => q.category === cat.id) : [];
  const percent = Math.round((step / (total - 1)) * 100);

  const next = () => {
    if (isReview) {
      track('health_check_complete', { overall_label: results.overallLabel });
      setPhase('results');
    } else setStep((s) => s + 1);
  };

  return (
    <div className="cx-hc" data-i18n-skip>
      <div className="cx-progress" role="group" aria-label={tr(hc.progress, tl)}>
        <p>{fmt(tr(hc.stepOf, tl), { n: step + 1, total })}</p>
        <progress max={100} value={percent} aria-label={tr(hc.progress, tl)} />
      </div>

      {isAbout && (
        <>
          <h2 ref={headingRef} tabIndex={-1}>{tr(hc.aboutYou, tl)}</h2>
          <fieldset className="cx-q">
            <legend>{tr(hc.audienceQuestion, tl)}</legend>
            {audienceOptions.map((o) => (
              <label key={o.value} className="cx-radio">
                <input type="radio" name="audience" value={o.value} checked={audience === o.value} onChange={() => setAudience(o.value)} />
                <span>{tr(o.label, tl)}</span>
              </label>
            ))}
          </fieldset>
          <fieldset className="cx-q">
            <legend>{tr(hc.aiQuestion, tl)}</legend>
            <label className="cx-radio">
              <input type="checkbox" checked={aiInterest} onChange={(e) => setAiInterest(e.target.checked)} />
              <span>{tr(hc.aiLabel, tl)}</span>
            </label>
          </fieldset>
          <p className="cx-note">{tr(hc.optionalNote, tl)}</p>
        </>
      )}

      {cat && (
        <>
          <h2 ref={headingRef} tabIndex={-1}>{tr(cat.title, tl)}</h2>
          <p className="cx-note">{tr(cat.description, tl)} {tr(hc.optionalNote, tl)}</p>
          {stepQuestions.map((q) => (
            <fieldset className="cx-q" key={q.id}>
              <legend>{tr(q.text, tl)}</legend>
              <div className="cx-radios">
                {answerOptions.map((o) => (
                  <label key={o.value} className="cx-radio">
                    <input type="radio" name={q.id} value={o.value} checked={answers[q.id] === o.value} onChange={() => setAnswer(q.id, o.value)} />
                    <span>{tr(o.label, tl)}</span>
                  </label>
                ))}
              </div>
              {answers[q.id] && (
                <button type="button" className="cx-link" onClick={() => setAnswer(q.id, undefined)}>
                  {tr(hc.clear, tl)}
                </button>
              )}
            </fieldset>
          ))}
        </>
      )}

      {isReview && (
        <>
          <h2 ref={headingRef} tabIndex={-1}>{tr(hc.reviewTitle, tl)}</h2>
          <p className="cx-note">{tr(hc.optionalNote, tl)}</p>
          {cats.map((c, i) => (
            <section key={c.id} className="cx-review" aria-labelledby={`rv-${c.id}`}>
              <div className="cx-review-head">
                <h3 id={`rv-${c.id}`}>{tr(c.title, tl)}</h3>
                <button type="button" className="cx-link" onClick={() => setStep(i + 1)} aria-label={`${tr(hc.edit, tl)}: ${tr(c.title, tl)}`}>{tr(hc.edit, tl)}</button>
              </div>
              <dl>
                {visibleQuestions(profile).filter((q) => q.category === c.id).map((q) => (
                  <div key={q.id}><dt>{tr(q.text, tl)}</dt><dd>{answerLabel(answers[q.id])}</dd></div>
                ))}
              </dl>
            </section>
          ))}
        </>
      )}

      <div className="cx-nav-row">
        <button type="button" className="cx-btn cx-btn-secondary" onClick={() => (step === 0 ? setPhase('intro') : setStep((s) => s - 1))}>{tr(hc.back, tl)}</button>
        <button type="button" className="cx-btn" onClick={next} disabled={isAbout && !audience}>
          {isReview ? tr(hc.seeResults, tl) : step === total - 2 ? tr(hc.review, tl) : tr(hc.next, tl)}
        </button>
      </div>
    </div>
  );
}


