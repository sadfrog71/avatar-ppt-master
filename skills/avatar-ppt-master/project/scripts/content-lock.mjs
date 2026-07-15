#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { buildContentLock, readJson } from './quality-core.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.goal || !args.plan || !args.out) usage();
const cwd = process.env.INIT_CWD || process.cwd();
const goalFile = path.resolve(cwd, args.goal);
const planFile = path.resolve(cwd, args.plan);
const evidenceFile = args.evidence ? path.resolve(cwd, args.evidence) : null;
const outFile = path.resolve(cwd, args.out);
const lock = buildContentLock({
  goal: readJson(goalFile),
  plan: readJson(planFile),
  evidence: evidenceFile ? readJson(evidenceFile) : null,
  sources: { goal: goalFile, compositionPlan: planFile, evidenceLedger: evidenceFile },
});
writeFileSync(outFile, `${JSON.stringify(lock, null, 2)}\n`);
console.log(`Content locked: ${outFile}`);

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith('--')) result[argv[i].slice(2)] = argv[++i];
  }
  return result;
}

function usage() {
  console.error('Usage: node scripts/content-lock.mjs --goal goal.json --plan composition-plan.json [--evidence evidence-ledger.json] --out content-lock.json');
  process.exit(2);
}
