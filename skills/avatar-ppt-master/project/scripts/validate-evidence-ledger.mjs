#!/usr/bin/env node
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readJson, validateEvidenceLedger } from './quality-core.mjs';

export function validateEvidenceFile(file) {
  return validateEvidenceLedger(readJson(file));
}

function main() {
  const file = process.argv[2];
  if (!file) usage();
  const resolved = path.resolve(process.env.INIT_CWD || process.cwd(), file);
  const result = validateEvidenceFile(resolved);
  result.warnings.forEach(message => console.warn(`Warning: ${message}`));
  if (result.errors.length) {
    result.errors.forEach(message => console.error(`Error: ${message}`));
    process.exit(1);
  }
  console.log(`Evidence ledger valid: ${resolved}`);
}

function usage() {
  console.error('Usage: node scripts/validate-evidence-ledger.mjs <evidence-ledger.json>');
  process.exit(2);
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) main();
