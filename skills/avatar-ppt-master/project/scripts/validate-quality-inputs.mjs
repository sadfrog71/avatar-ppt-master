#!/usr/bin/env node
import { existsSync } from 'node:fs';
import path from 'node:path';
import { getLayoutRecord } from './skill-workflow-utils.mjs';
import {
  readJson,
  validateCompositionPlan,
  validateContentLock,
  validateEvidenceLedger,
} from './quality-core.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.goal) usage();
const cwd = process.env.INIT_CWD || process.cwd();
const goalFile = path.resolve(cwd, args.goal);
const deckDir = path.dirname(goalFile);
const planFile = path.resolve(cwd, args.plan || path.join(deckDir, 'composition-plan.json'));
const evidenceFile = path.resolve(cwd, args.evidence || path.join(deckDir, 'evidence-ledger.json'));
const lockFile = path.resolve(cwd, args.lock || path.join(deckDir, 'content-lock.json'));
const goal = readJson(goalFile);
const risk = detectEvidenceRisk(goal);
const errors = [];
const warnings = [];

if (!existsSync(planFile)) {
  errors.push(`composition plan is required: ${planFile}`);
} else {
  const plan = readJson(planFile);
  let evidence = null;
  let evidenceIds = new Set();
  if (existsSync(evidenceFile)) {
    evidence = readJson(evidenceFile);
    const result = validateEvidenceLedger(evidence);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
    evidenceIds = result.ids;
  } else if (risk.required) {
    errors.push(`evidence ledger is required for this deck (${risk.reasons.join(', ')}): ${evidenceFile}`);
  }

  const planResult = validateCompositionPlan(plan, { expectedPages: goal?.slides?.length || goal?.pageCount, evidenceIds });
  errors.push(...planResult.errors);
  warnings.push(...planResult.warnings);
  if (risk.required && planResult.mode !== 'evidence') {
    errors.push(`composition plan mode must be "evidence" for this deck (${risk.reasons.join(', ')})`);
  }

  if (existsSync(lockFile)) {
    const result = validateContentLock(readJson(lockFile), { goal, plan, evidence });
    errors.push(...result.errors);
  } else if (risk.required) {
    errors.push(`content lock is required for this deck: ${lockFile}`);
  }
}

warnings.forEach(message => console.warn(`Warning: ${message}`));
if (errors.length) {
  errors.forEach(message => console.error(`Error: ${message}`));
  process.exit(1);
}
console.log(`Quality inputs valid (${risk.required ? `evidence mode: ${risk.reasons.join(', ')}` : 'standard mode'}).`);

export function detectEvidenceRisk(goal) {
  const slides = Array.isArray(goal?.slides) ? goal.slides : [];
  const reasons = [];
  if (slides.length >= 15) reasons.push('15+ slides');
  if (slides.some(slide => isChartLayout(slide?.layout))) reasons.push('data chart');
  if (slides.some(slide => containsFormulaOrDerivedMetric(slide?.props))) reasons.push('formula or derived metric');
  return { required: reasons.length > 0, reasons: [...new Set(reasons)] };
}

function isChartLayout(layout) {
  const slot = String(getLayoutRecord(layout)?.page?.slot || '').toLowerCase();
  return /chart|trend|donut|waterfall|quadrant|funnel|bar|line|distribution/.test(slot)
    || /^theme13_page0(?:25|26|27|28|29|30)$/.test(String(layout || ''));
}

function containsFormulaOrDerivedMetric(value) {
  const text = flattenStrings(value).join(' ');
  return /(?:[=×÷∑]|同比|环比|占比|百分点|转化率|增长率|模拟结果|测算结果|派生|加权)/i.test(text);
}

function flattenStrings(value, output = []) {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach(item => flattenStrings(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach(item => flattenStrings(item, output));
  return output;
}

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith('--')) result[argv[i].slice(2)] = argv[++i];
  }
  return result;
}

function usage() {
  console.error('Usage: node scripts/validate-quality-inputs.mjs --goal goal.json [--plan composition-plan.json --evidence evidence-ledger.json --lock content-lock.json]');
  process.exit(2);
}
