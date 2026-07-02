#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { composeDeck } from '../src/deckComposer.jsx';
import { renderDeck } from '../src/renderDeck.jsx';
import { validateGoalSpec } from './validate-goal-spec.mjs';

const [, , specArg, outArg] = process.argv;

if (!specArg || !outArg) {
  console.error('Usage: npm run render:goal -- <goal-spec.json> <output/ppt/index.html>');
  process.exit(2);
}

try {
  const specPath = path.resolve(specArg);
  const outFile = path.resolve(outArg);
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const specErrors = validateGoalSpec(spec);
  if (specErrors.length) {
    console.error('Goal spec validation failed:');
    for (const error of specErrors) console.error(`- ${scrubLocalPaths(error)}`);
    process.exit(1);
  }
  const deck = composeDeck(spec);

  renderDeck(deck, { outFile });
  copyGoalSpec(specPath, outFile);
  console.log(`Rendered ${deck.slides.length} slide(s): ${displayPath(outFile)}`);
} catch (error) {
  console.error(`Could not render goal deck: ${scrubLocalPaths(error?.message || error)}`);
  process.exit(1);
}

function copyGoalSpec(from, to) {
  const outDir = path.dirname(to);
  const deckDir = path.basename(outDir) === 'ppt' ? path.dirname(outDir) : outDir;
  const target = path.join(deckDir, 'goal.json');
  fs.mkdirSync(deckDir, { recursive: true });
  if (path.resolve(from) !== path.resolve(target)) {
    fs.copyFileSync(from, target);
  }
}

function displayPath(file) {
  const relative = path.relative(process.cwd(), file);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative) ? relative : path.basename(file);
}

function scrubLocalPaths(value) {
  return String(value || '')
    .replace(/file:\/\/\/?[^\s"'`<>),;]*/gi, '<local-path>')
    .replace(/\/(?:private\/)?var\/[^\s"'`<>),;\r\n]+(?:\/[^/\\"'`<>),;\r\n]+)*/g, '<local-path>')
    .replace(/\/Users\/[^/\\"'`<>),;\r\n]+(?:\/[^/\\"'`<>),;\r\n]+)*/g, '<local-path>')
    .replace(/\/Volumes\/[^/\\"'`<>),;\r\n]+(?:\/[^/\\"'`<>),;\r\n]+)*/g, '<local-path>')
    .replace(/\/home\/[^/\\"'`<>),;\r\n]+(?:\/[^/\\"'`<>),;\r\n]+)*/g, '<local-path>')
    .replace(/(?<![A-Za-z])[A-Za-z]:[\\/][^\s"'`<>),;]+(?:[\\/][^\s"'`<>),;]+)*/g, '<local-path>');
}
