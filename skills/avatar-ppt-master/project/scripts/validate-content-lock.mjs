#!/usr/bin/env node
import path from 'node:path';
import { readJson, validateContentLock } from './quality-core.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.lock || !args.goal || !args.plan) usage();
const cwd = process.env.INIT_CWD || process.cwd();
const evidence = args.evidence ? readJson(path.resolve(cwd, args.evidence)) : null;
const result = validateContentLock(readJson(path.resolve(cwd, args.lock)), {
  goal: readJson(path.resolve(cwd, args.goal)),
  plan: readJson(path.resolve(cwd, args.plan)),
  evidence,
});
if (result.errors.length) {
  result.errors.forEach(message => console.error(`Error: ${message}`));
  process.exit(1);
}
console.log('Content lock valid.');

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith('--')) result[argv[i].slice(2)] = argv[++i];
  }
  return result;
}

function usage() {
  console.error('Usage: node scripts/validate-content-lock.mjs --lock content-lock.json --goal goal.json --plan composition-plan.json [--evidence evidence-ledger.json]');
  process.exit(2);
}
