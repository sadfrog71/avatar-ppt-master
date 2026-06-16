#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { exportEditablePptxFromUrl } from '../src/export-pptx/editable.mjs';

const CHROME_PATH = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const url = getArg('--url');
const outFile = getArg('--out') || 'output/editable-export/deck.pptx';
const reportFile = getArg('--report') || 'output/editable-export/report.json';

if (!url) {
  console.error('Usage: node scripts/export-editable-pptx.mjs --url <preview-url> [--out output/deck.pptx] [--report output/report.json]');
  process.exit(2);
}

if (!existsSync(CHROME_PATH)) {
  throw new Error(`Chrome executable not found: ${CHROME_PATH}
Set CHROME_PATH to a local Chrome/Chromium executable and rerun the export.`);
}

const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
try {
  const result = await exportEditablePptxFromUrl(browser, url, { outFile, reportFile });
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close().catch(() => {});
}

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}
