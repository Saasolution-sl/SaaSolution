/**
 * Technology Project Health Check — deterministic scoring.
 *
 * METHODOLOGY (kept deliberately simple so it can be audited by reading this file):
 *
 *  1. Each answer maps to points:  full = 100, partial = 50, none = 0.
 *  2. "Not sure" is NOT treated as a missing control: it is excluded from the
 *     score and reported separately as an uncertainty.
 *     "Not applicable" is excluded and never penalised. Skipped questions are
 *     reported as unanswered.
 *  3. A category score is the mean of its known answers (rounded). A category
 *     needs at least MIN_KNOWN_PER_CATEGORY known answers, otherwise it is
 *     reported as "insufficient information" and is not scored.
 *  4. The overall indicator is the UNWEIGHTED mean of the scored category
 *     scores (all categories count equally — no weighting is applied because we
 *     have no evidence that one category should dominate for every project).
 *     It needs at least MIN_SCORED_CATEGORIES scored categories AND
 *     MIN_KNOWN_OVERALL known answers, otherwise the overall result is
 *     "insufficient information" — no number is invented.
 *  5. Results are preliminary, self-reported indicators. They are not an audit,
 *     certification or proof of compliance or security.
 */
import {
  audienceOptions,
  categories,
  maturityLabels,
  questions,
  type Audience,
  type AnswerValue,
  type Category,
  type CategoryId,
  type Lang,
  type Question,
  type ServiceKey,
} from './questions.ts';

export const POINTS: Record<'full' | 'partial' | 'none', number> = { full: 100, partial: 50, none: 0 };

/** Score thresholds (inclusive lower bounds). */
export const THRESHOLDS = { strong: 75, developing: 50 } as const;
export const MIN_KNOWN_PER_CATEGORY = 2;
export const MIN_SCORED_CATEGORIES = 3;
export const MIN_KNOWN_OVERALL = 8;
/** A service is recommended when its gap weight reaches this value (none = 2, partial = 1). */
export const RECOMMENDATION_MIN_WEIGHT = 2;
export const MAX_RECOMMENDATIONS = 3;

export type Profile = { audience: Audience | null; aiInterest: boolean };
export type Answers = Partial<Record<string, AnswerValue>>;
export type MaturityLabel = 'strong' | 'developing' | 'attention' | 'insufficient';

export type CategoryResult = {
  id: CategoryId;
  score: number | null;
  label: MaturityLabel;
  total: number;
  known: number;
  unsure: number;
  notApplicable: number;
  unanswered: number;
};

export type Recommendation = {
  service: ServiceKey;
  weight: number;
  /** Questions whose answers drove the recommendation. */
  drivers: string[];
};

export type HealthCheckResults = {
  overallScore: number | null;
  overallLabel: MaturityLabel;
  categories: CategoryResult[];
  strengths: CategoryId[];
  improvementAreas: { category: CategoryId; questions: string[] }[];
  uncertain: { category: CategoryId; unsure: number; unanswered: number }[];
  recommendations: Recommendation[];
  knownAnswers: number;
};

export function labelForScore(score: number | null): MaturityLabel {
  if (score === null) return 'insufficient';
  if (score >= THRESHOLDS.strong) return 'strong';
  if (score >= THRESHOLDS.developing) return 'developing';
  return 'attention';
}

export function visibleCategories(profile: Profile): Category[] {
  return categories.filter((c) => {
    if (c.requiresAi && !profile.aiInterest) return false;
    if (c.audiences && (!profile.audience || !c.audiences.includes(profile.audience))) return false;
    return true;
  });
}

export function visibleQuestions(profile: Profile): Question[] {
  const ids = new Set(visibleCategories(profile).map((c) => c.id));
  return questions.filter((q) => ids.has(q.category));
}

const isScored = (value: AnswerValue | undefined): value is 'full' | 'partial' | 'none' =>
  value === 'full' || value === 'partial' || value === 'none';

const mean = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;

export function computeResults(profile: Profile, answers: Answers): HealthCheckResults {
  const visible = visibleQuestions(profile);
  const cats: CategoryResult[] = [];
  let knownAnswers = 0;

  for (const category of visibleCategories(profile)) {
    const qs = visible.filter((q) => q.category === category.id);
    const values = qs.map((q) => answers[q.id]);
    const scored = values.filter(isScored).map((v) => POINTS[v]);
    const known = scored.length;
    knownAnswers += known;
    const score = known >= MIN_KNOWN_PER_CATEGORY ? Math.round(mean(scored)) : null;
    cats.push({
      id: category.id,
      score,
      label: labelForScore(score),
      total: qs.length,
      known,
      unsure: values.filter((v) => v === 'unsure').length,
      notApplicable: values.filter((v) => v === 'na').length,
      unanswered: values.filter((v) => v === undefined).length,
    });
  }

  const scoredCats = cats.filter((c) => c.score !== null);
  const overallScore = scoredCats.length >= MIN_SCORED_CATEGORIES && knownAnswers >= MIN_KNOWN_OVERALL
    ? Math.round(mean(scoredCats.map((c) => c.score as number)))
    : null;

  const strengths = scoredCats.filter((c) => (c.score as number) >= THRESHOLDS.strong).map((c) => c.id);

  const improvementAreas = cats
    .map((c) => ({
      category: c.id,
      questions: visible
        .filter((q) => q.category === c.id && (answers[q.id] === 'none' || answers[q.id] === 'partial'))
        // "none" gaps first, then "partial", stable by question order
        .sort((a, b) => Number(answers[a.id] === 'partial') - Number(answers[b.id] === 'partial'))
        .map((q) => q.id),
    }))
    .filter((a) => a.questions.length > 0);

  const uncertain = cats
    .filter((c) => c.unsure > 0 || c.unanswered > 0)
    .map((c) => ({ category: c.id, unsure: c.unsure, unanswered: c.unanswered }));

  const byService = new Map<ServiceKey, Recommendation>();
  for (const q of visible) {
    const a = answers[q.id];
    const weight = a === 'none' ? 2 : a === 'partial' ? 1 : 0;
    if (!weight) continue;
    const existing = byService.get(q.service) ?? { service: q.service, weight: 0, drivers: [] };
    existing.weight += weight;
    existing.drivers.push(q.id);
    byService.set(q.service, existing);
  }
  const recommendations = [...byService.values()]
    .filter((r) => r.weight >= RECOMMENDATION_MIN_WEIGHT)
    .sort((a, b) => b.weight - a.weight || a.service.localeCompare(b.service))
    .slice(0, MAX_RECOMMENDATIONS);

  return {
    overallScore,
    overallLabel: labelForScore(overallScore),
    categories: cats,
    strengths,
    improvementAreas,
    uncertain,
    recommendations,
    knownAnswers,
  };
}

/**
 * Plain-text summary that the visitor may choose to attach to an inquiry.
 * Contains scores and gap statements only — never free text typed by the visitor.
 */
export function buildSummary(profile: Profile, results: HealthCheckResults, lang: Lang): string {
  const title = (id: CategoryId) => categories.find((c) => c.id === id)?.title[lang] ?? id;
  const gapText = (id: string) => questions.find((q) => q.id === id)?.gap[lang] ?? id;
  const t = lang === 'es'
    ? { head: 'Resumen preliminar del Diagnóstico Inicial de Salud Tecnológica (autodeclarado, no es una auditoría)', overall: 'Indicador global', insufficient: 'Información insuficiente', areas: 'Áreas de mejora', none: 'Ninguna identificada' }
    : { head: 'Preliminary Technology Project Health Check summary (self-reported, not an audit)', overall: 'Overall indicator', insufficient: 'Insufficient information', areas: 'Improvement areas', none: 'None identified' };
  const lines = [
    t.head,
    `${t.overall}: ${results.overallScore === null ? t.insufficient : `${results.overallScore}/100 (${maturityLabels[results.overallLabel][lang]})`}`,
    `${lang === 'es' ? 'Tipo de organización' : 'Organization type'}: ${audienceOptions.find((a) => a.value === profile.audience)?.label[lang] ?? 'n/a'}`,
    '',
    ...results.categories.map((c) => `- ${title(c.id)}: ${c.score === null ? t.insufficient : `${c.score}/100`}`),
    '',
    `${t.areas}:`,
    ...(results.improvementAreas.length
      ? results.improvementAreas.flatMap((a) => a.questions.map((q) => `- [${title(a.category)}] ${gapText(q)}`))
      : [`- ${t.none}`]),
  ];
  return lines.join('\n');
}
