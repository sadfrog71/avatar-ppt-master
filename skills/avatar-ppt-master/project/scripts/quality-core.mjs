import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

export const EVIDENCE_MODES = new Set(['standard', 'evidence']);
export const SCR_ROLES = new Set(['situation', 'complication', 'resolution', 'none']);
export const DENSITY_TARGETS = new Set(['sparse', 'balanced', 'dense']);

export function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function sha256Json(value) {
  return createHash('sha256').update(canonicalJson(value)).digest('hex');
}

export function validateEvidenceLedger(ledger) {
  const errors = [];
  const warnings = [];
  const items = Array.isArray(ledger?.items) ? ledger.items : [];
  if (!items.length) errors.push('evidence ledger must contain a non-empty items array');

  const ids = new Set();
  const claims = new Map();
  items.forEach((item, index) => {
    const label = `evidence item ${index + 1}`;
    const id = clean(item?.id);
    if (!id) errors.push(`${label}: id is required`);
    else if (ids.has(id)) errors.push(`${label}: duplicate id "${id}"`);
    else ids.add(id);

    if (!clean(item?.claim)) errors.push(`${label}${id ? ` (${id})` : ''}: claim is required`);
    if (item?.value != null && item.value !== '' && !clean(item?.unit)) {
      errors.push(`${label}${id ? ` (${id})` : ''}: a value requires an explicit unit`);
    }
    if (!clean(item?.period) && item?.value != null && item.value !== '') {
      warnings.push(`${label}${id ? ` (${id})` : ''}: numeric evidence has no period or scenario`);
    }

    const source = item?.source;
    if (!source || typeof source !== 'object') {
      errors.push(`${label}${id ? ` (${id})` : ''}: source object is required`);
    } else {
      if (!clean(source.type)) errors.push(`${label}${id ? ` (${id})` : ''}: source.type is required`);
      if (!clean(source.label)) errors.push(`${label}${id ? ` (${id})` : ''}: source.label is required`);
      if (!clean(source.location) && !['illustrative', 'calculation'].includes(clean(source.type))) {
        warnings.push(`${label}${id ? ` (${id})` : ''}: source.location is empty`);
      }
    }

    if (!['high', 'medium', 'low'].includes(clean(item?.confidence))) {
      errors.push(`${label}${id ? ` (${id})` : ''}: confidence must be high, medium or low`);
    }
    if (!clean(item?.implication)) warnings.push(`${label}${id ? ` (${id})` : ''}: implication is empty`);
    if (!clean(item?.recommendedVisual)) warnings.push(`${label}${id ? ` (${id})` : ''}: recommendedVisual is empty`);

    if (item?.normalized && typeof item.normalized === 'object') {
      if (item.normalized.value == null || item.normalized.value === '') errors.push(`${label}${id ? ` (${id})` : ''}: normalized.value is required`);
      if (!clean(item.normalized.unit)) errors.push(`${label}${id ? ` (${id})` : ''}: normalized.unit is required`);
      if (!clean(item.normalized.method)) errors.push(`${label}${id ? ` (${id})` : ''}: normalized.method is required`);
    }

    const claimKey = clean(item?.claim).toLowerCase().replace(/\s+/g, '');
    if (claimKey) {
      const signature = `${String(item?.value ?? '')}|${clean(item?.unit)}|${clean(item?.period)}`;
      const previous = claims.get(claimKey);
      if (previous && previous.signature !== signature) {
        warnings.push(`${label}${id ? ` (${id})` : ''}: same claim conflicts with ${previous.id}; record the discrepancy in caveat instead of silently choosing one value`);
      } else if (!previous) {
        claims.set(claimKey, { id: id || label, signature });
      }
    }
  });
  return { errors, warnings, ids };
}

export function validateCompositionPlan(plan, options = {}) {
  const errors = [];
  const warnings = [];
  const pages = Array.isArray(plan?.pages) ? plan.pages : [];
  const mode = clean(plan?.mode) || 'standard';
  if (!EVIDENCE_MODES.has(mode)) errors.push('composition plan mode must be standard or evidence');
  if (!pages.length) errors.push('composition plan must contain a non-empty pages array');
  if (options.expectedPages != null && pages.length !== Number(options.expectedPages)) {
    errors.push(`composition plan page count ${pages.length} does not match goal slide count ${options.expectedPages}`);
  }

  const pageNumbers = new Set();
  const evidenceIds = options.evidenceIds || new Set();
  pages.forEach((page, index) => {
    const label = `composition page ${index + 1}`;
    const number = Number(page?.page);
    if (!Number.isInteger(number) || number < 1) errors.push(`${label}: page must be a positive integer`);
    else if (pageNumbers.has(number)) errors.push(`${label}: duplicate page number ${number}`);
    else pageNumbers.add(number);

    for (const field of ['pageJob', 'relationship', 'messageTitle', 'visualTranslation', 'visualFamily', 'primaryFocus', 'imagePolicy']) {
      if (!clean(page?.[field])) errors.push(`${label}: ${field} is required`);
    }
    if (!clean(page?.insightStrip) && !['cover', 'agenda', 'closing'].includes(clean(page?.pageJob))) {
      warnings.push(`${label}: insightStrip is empty`);
    }

    if (mode === 'evidence') {
      if (!SCR_ROLES.has(clean(page?.scrRole))) errors.push(`${label}: scrRole must be situation, complication, resolution or none`);
      if (!DENSITY_TARGETS.has(clean(page?.densityTarget))) errors.push(`${label}: densityTarget must be sparse, balanced or dense`);
      if (!Array.isArray(page?.componentInventory) || !page.componentInventory.length) errors.push(`${label}: componentInventory must be a non-empty array`);
      if (!clean(page?.soWhat) && !['cover', 'agenda', 'closing'].includes(clean(page?.pageJob))) errors.push(`${label}: soWhat is required in evidence mode`);
      if (!Array.isArray(page?.evidenceIds)) errors.push(`${label}: evidenceIds must be an array in evidence mode`);
    }

    for (const id of Array.isArray(page?.evidenceIds) ? page.evidenceIds : []) {
      if (!evidenceIds.has(String(id))) errors.push(`${label}: evidence id "${id}" does not exist in evidence-ledger.json`);
    }
  });

  return { errors, warnings, mode };
}

export function buildContentLock({ goal, plan, evidence = null, sources = {} }) {
  const pages = Array.isArray(plan?.pages) ? plan.pages.map(page => ({
    page: page.page,
    pageJob: page.pageJob,
    messageTitle: page.messageTitle,
    scrRole: page.scrRole || 'none',
    evidenceIds: Array.isArray(page.evidenceIds) ? page.evidenceIds : [],
    caveat: page.caveat || '',
    soWhat: page.soWhat || page.insightStrip || '',
  })) : [];
  return {
    version: '1.0',
    algorithm: 'sha256-canonical-json',
    createdAt: new Date().toISOString(),
    sources,
    hashes: {
      goal: sha256Json(goal),
      compositionPlan: sha256Json(plan),
      evidenceLedger: evidence ? sha256Json(evidence) : null,
    },
    pages,
  };
}

export function validateContentLock(lock, { goal, plan, evidence = null }) {
  const errors = [];
  if (lock?.algorithm !== 'sha256-canonical-json') errors.push('content lock uses an unsupported algorithm');
  const expected = {
    goal: sha256Json(goal),
    compositionPlan: sha256Json(plan),
    evidenceLedger: evidence ? sha256Json(evidence) : null,
  };
  for (const [key, value] of Object.entries(expected)) {
    if ((lock?.hashes?.[key] ?? null) !== value) errors.push(`content lock mismatch: ${key} changed after lock creation`);
  }
  return { errors, expected };
}

function clean(value) {
  return String(value ?? '').trim();
}
