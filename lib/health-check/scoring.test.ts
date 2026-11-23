import { test } from 'node:test';
import assert from 'node:assert/strict';
import { categories, questions } from './questions.ts';
import {
  buildSummary,
  computeResults,
  labelForScore,
  visibleCategories,
  visibleQuestions,
  type Answers,
  type Profile,
} from './scoring.ts';
import type { AnswerValue } from './questions.ts';

const priv: Profile = { audience: 'private', aiInterest: false };
const fill = (profile: Profile, value: AnswerValue): Answers =>
  Object.fromEntries(visibleQuestions(profile).map((q) => [q.id, value]));

test('every question belongs to a defined category and has both languages', () => {
  const ids = new Set(categories.map((c) => c.id));
  for (const q of questions) {
    assert.ok(ids.has(q.category), q.id);
    assert.ok(q.text.en && q.text.es && q.gap.en && q.gap.es, q.id);
  }
  assert.equal(new Set(questions.map((q) => q.id)).size, questions.length, 'unique ids');
});

test('conditional logic: AI and public categories appear only when relevant', () => {
  assert.deepEqual(visibleCategories(priv).map((c) => c.id), ['strategy', 'architecture', 'security', 'delivery', 'vendor']);
  assert.ok(visibleCategories({ audience: 'private', aiInterest: true }).some((c) => c.id === 'ai'));
  assert.ok(visibleCategories({ audience: 'public', aiInterest: false }).some((c) => c.id === 'public'));
  assert.ok(!visibleCategories({ audience: 'nonprofit', aiInterest: false }).some((c) => c.id === 'public'));
  assert.equal(visibleQuestions({ audience: 'public', aiInterest: true }).length, questions.length);
});

test('all fully implemented scores 100 and is strong', () => {
  const r = computeResults(priv, fill(priv, 'full'));
  assert.equal(r.overallScore, 100);
  assert.equal(r.overallLabel, 'strong');
  assert.equal(r.strengths.length, 5);
  assert.deepEqual(r.recommendations, []);
});

test('all partial scores 50 (developing); all none scores 0 (attention)', () => {
  assert.equal(computeResults(priv, fill(priv, 'partial')).overallScore, 50);
  assert.equal(computeResults(priv, fill(priv, 'partial')).overallLabel, 'developing');
  const none = computeResults(priv, fill(priv, 'none'));
  assert.equal(none.overallScore, 0);
  assert.equal(none.overallLabel, 'attention');
});

test('threshold boundaries', () => {
  assert.equal(labelForScore(75), 'strong');
  assert.equal(labelForScore(74), 'developing');
  assert.equal(labelForScore(50), 'developing');
  assert.equal(labelForScore(49), 'attention');
  assert.equal(labelForScore(null), 'insufficient');
});

test('"Not sure" is excluded from the score and reported as uncertainty', () => {
  const answers = fill(priv, 'full');
  answers.A1 = 'unsure';
  const r = computeResults(priv, answers);
  assert.equal(r.overallScore, 100); // not treated as a missing control
  const a = r.categories.find((c) => c.id === 'strategy')!;
  assert.equal(a.unsure, 1);
  assert.equal(a.known, 3);
  assert.ok(r.uncertain.some((u) => u.category === 'strategy' && u.unsure === 1));
});

test('"Not applicable" is not penalised', () => {
  const answers = fill(priv, 'full');
  answers.B1 = 'na';
  answers.B2 = 'na';
  const r = computeResults(priv, answers);
  assert.equal(r.categories.find((c) => c.id === 'architecture')!.score, 100);
});

test('category with too few known answers is "insufficient", not scored', () => {
  const answers = fill(priv, 'full');
  answers.C1 = 'unsure';
  answers.C2 = 'unsure';
  answers.C3 = 'unsure';
  const sec = computeResults(priv, answers).categories.find((c) => c.id === 'security')!;
  assert.equal(sec.score, null);
  assert.equal(sec.label, 'insufficient');
});

test('overall is "insufficient" when evidence is thin — no invented score', () => {
  assert.equal(computeResults(priv, {}).overallScore, null);
  assert.equal(computeResults(priv, {}).overallLabel, 'insufficient');
  // only two categories answered
  const two: Answers = { A1: 'full', A2: 'full', A3: 'full', A4: 'full', B1: 'full', B2: 'full', B3: 'full', B4: 'full' };
  assert.equal(computeResults(priv, two).overallScore, null);
  // everything unsure
  assert.equal(computeResults(priv, fill(priv, 'unsure')).overallScore, null);
});

test('overall score is the unweighted mean of category scores', () => {
  const answers = fill(priv, 'full');
  for (const id of ['D1', 'D2', 'D3', 'D4']) answers[id] = 'none'; // delivery = 0
  assert.equal(computeResults(priv, answers).overallScore, 80); // (100*4+0)/5
});

test('recommendations map gaps to the relevant service', () => {
  const answers = fill(priv, 'full');
  answers.E1 = 'none';
  answers.E2 = 'none'; // oversight weight 4
  answers.B1 = 'none'; // audit weight 2
  const r = computeResults(priv, answers);
  assert.deepEqual(r.recommendations.map((x) => x.service), ['oversight', 'audit']);
  assert.deepEqual(r.recommendations[0].drivers, ['E1', 'E2']);
});

test('a single partial answer is not enough to trigger a recommendation', () => {
  const answers = fill(priv, 'full');
  answers.A1 = 'partial';
  assert.deepEqual(computeResults(priv, answers).recommendations, []);
});

test('public procurement gaps recommend tender advisory', () => {
  const pub: Profile = { audience: 'public', aiInterest: false };
  const answers = fill(pub, 'full');
  answers.P1 = 'none';
  answers.P2 = 'partial';
  const r = computeResults(pub, answers);
  assert.equal(r.recommendations[0].service, 'tender');
});

test('AI gaps recommend AI & automation only when the AI category is shown', () => {
  const ai: Profile = { audience: 'private', aiInterest: true };
  const answers = fill(ai, 'full');
  answers.F1 = 'none';
  assert.equal(computeResults(ai, answers).recommendations[0].service, 'ai');
  // Stale AI answers are ignored when AI interest is off
  assert.deepEqual(computeResults(priv, { ...fill(priv, 'full'), F1: 'none' }).recommendations, []);
});

test('scoring is deterministic', () => {
  const answers = { ...fill(priv, 'partial'), A1: 'none' as const };
  assert.deepEqual(computeResults(priv, answers), computeResults(priv, answers));
});

test('summary contains scores and gaps but no free text, in both languages', () => {
  const answers = fill(priv, 'full');
  answers.D1 = 'none';
  const r = computeResults(priv, answers);
  const en = buildSummary(priv, r, 'en');
  const es = buildSummary(priv, r, 'es');
  assert.match(en, /Milestones are not tracked/);
  assert.match(es, /Los hitos no se siguen/);
  assert.match(en, /self-reported, not an audit/);
});
