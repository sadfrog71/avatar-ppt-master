#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import JSZip from 'jszip';

const EMU_PER_INCH = 914400;

export async function validatePptxStructure(file, options = {}) {
  const buffer = readFileSync(file);
  const zip = await JSZip.loadAsync(buffer);
  const presentation = await xml(zip, 'ppt/presentation.xml');
  if (!presentation) throw new Error('ppt/presentation.xml is missing');
  const sizeMatch = presentation.match(/<p:sldSz\b[^>]*\bcx="(\d+)"[^>]*\bcy="(\d+)"/);
  const width = Number(sizeMatch?.[1] || 0);
  const height = Number(sizeMatch?.[2] || 0);
  const slideFiles = Object.keys(zip.files)
    .filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => numberFrom(a) - numberFrom(b));
  const errors = [];
  const warnings = [];
  const slides = [];
  const minFontPt = Number(options.minFontPt ?? 7.5);
  const strict = options.strict === true;

  if (!width || !height) errors.push('slide size is missing');
  else if (Math.abs(width / height - 16 / 9) > 0.02) errors.push(`slide aspect ratio is ${(width / height).toFixed(3)}, expected 16:9`);
  if (options.expectedPages != null && slideFiles.length !== Number(options.expectedPages)) {
    errors.push(`PPTX contains ${slideFiles.length} slides, expected ${options.expectedPages}`);
  }

  for (const [index, name] of slideFiles.entries()) {
    const source = await xml(zip, name);
    const report = inspectSlide(source, { width, height, minFontPt });
    report.slide = index + 1;
    slides.push(report);
    for (const message of report.errors) errors.push(`slide ${index + 1}: ${message}`);
    for (const message of report.warnings) warnings.push(`slide ${index + 1}: ${message}`);
    if (strict && report.nativeTextChars === 0 && report.pictureCount > 0) {
      errors.push(`slide ${index + 1}: no editable text; content appears image-only`);
    }
  }

  const visualReview = ['passed', 'failed', 'pending'].includes(options.visualReview) ? options.visualReview : 'pending';
  const editableInformationLayer = errors.length === 0 && slides.every(slide => slide.nativeTextChars > 0 || slide.chartCount > 0 || slide.tableCount > 0);
  return {
    version: '1.0',
    file: path.resolve(file),
    slideSize: { widthEmu: width, heightEmu: height, widthIn: round(width / EMU_PER_INCH), heightIn: round(height / EMU_PER_INCH) },
    slideCount: slideFiles.length,
    gates: {
      editableInformationLayer: { status: editableInformationLayer ? 'passed' : 'failed' },
      visualSemanticsPreserved: { status: visualReview, note: 'Only render review can verify hierarchy, chart meaning and template fidelity.' },
      finalDeliveryReady: editableInformationLayer && visualReview === 'passed',
    },
    errors,
    warnings,
    slides,
  };
}

function inspectSlide(source, { width, height, minFontPt }) {
  const errors = [];
  const warnings = [];
  const objectPattern = /<(p:sp|p:pic|p:graphicFrame|p:cxnSp)\b[\s\S]*?<\/\1>/g;
  const objects = [...source.matchAll(objectPattern)].map(match => ({ type: match[1], xml: match[0] }));
  let nativeTextChars = 0;
  let pictureCount = 0;
  let shapeCount = 0;
  let chartCount = 0;
  let tableCount = 0;
  let minDetectedFontPt = null;
  let fullSlideImageRisk = false;

  for (const object of objects) {
    if (object.type === 'p:pic') pictureCount += 1;
    else shapeCount += 1;
    if (/<c:chart\b/.test(object.xml)) chartCount += 1;
    if (/<a:tbl\b/.test(object.xml)) tableCount += 1;

    const text = [...object.xml.matchAll(/<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/g)].map(match => decodeXml(match[1])).join('');
    nativeTextChars += text.trim().length;
    if (/(请输入|待补充|占位|Lorem ipsum|placeholder|sample text|\bTODO\b)/i.test(text)) errors.push(`placeholder text remains: "${text.trim().slice(0, 48)}"`);

    for (const match of object.xml.matchAll(/<(?:a:rPr|a:defRPr|a:endParaRPr)\b[^>]*\bsz="(\d+)"/g)) {
      const pt = Number(match[1]) / 100;
      if (pt > 0) minDetectedFontPt = minDetectedFontPt == null ? pt : Math.min(minDetectedFontPt, pt);
    }

    const box = objectBox(object.xml);
    if (box && width && height) {
      if (box.x < -1 || box.y < -1 || box.x + box.cx > width + 1 || box.y + box.cy > height + 1) {
        errors.push(`${object.type} extends outside slide canvas`);
      }
      const coverage = (box.cx * box.cy) / (width * height);
      if (object.type === 'p:pic' && coverage >= 0.8) fullSlideImageRisk = true;
    }
  }

  if (minDetectedFontPt != null && minDetectedFontPt < minFontPt) warnings.push(`minimum explicit font size is ${minDetectedFontPt} pt (threshold ${minFontPt} pt)`);
  if (fullSlideImageRisk && nativeTextChars < 20) warnings.push('full-slide image with little editable text; verify that information is not flattened');
  if (nativeTextChars === 0 && chartCount === 0 && tableCount === 0) warnings.push('no editable information object detected');
  return {
    nativeTextChars,
    pictureCount,
    shapeCount,
    chartCount,
    tableCount,
    minDetectedFontPt,
    fullSlideImageRisk,
    errors: [...new Set(errors)],
    warnings: [...new Set(warnings)],
  };
}

function objectBox(source) {
  const off = source.match(/<a:off\b[^>]*\bx="(-?\d+)"[^>]*\by="(-?\d+)"/);
  const ext = source.match(/<a:ext\b[^>]*\bcx="(\d+)"[^>]*\bcy="(\d+)"/);
  if (!off || !ext) return null;
  return { x: Number(off[1]), y: Number(off[2]), cx: Number(ext[1]), cy: Number(ext[2]) };
}

async function xml(zip, name) {
  return zip.file(name)?.async('string') || '';
}

function decodeXml(value) {
  return value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}

function numberFrom(name) {
  return Number(name.match(/(\d+)\.xml$/)?.[1] || 0);
}

function round(value) {
  return Math.round(value * 100) / 100;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const input = args._[0];
  if (!input) usage();
  const cwd = process.env.INIT_CWD || process.cwd();
  const file = path.resolve(cwd, input);
  const report = await validatePptxStructure(file, {
    expectedPages: args['expected-pages'],
    minFontPt: args['min-font'],
    visualReview: args['visual-review'],
    strict: args.strict === true,
  });
  const out = path.resolve(cwd, args.out || `${file}.qa.json`);
  writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);
  report.warnings.forEach(message => console.warn(`Warning: ${message}`));
  if (report.errors.length) {
    report.errors.forEach(message => console.error(`Error: ${message}`));
    console.error(`QA report: ${out}`);
    process.exit(1);
  }
  console.log(`PPTX structure valid: ${file}`);
  console.log(`QA report: ${out}`);
  if (report.gates.visualSemanticsPreserved.status === 'pending') console.log('Visual semantics gate remains pending until render review.');
}

function parseArgs(argv) {
  const result = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    if (!argv[i].startsWith('--')) result._.push(argv[i]);
    else if (argv[i] === '--strict') result.strict = true;
    else result[argv[i].slice(2)] = argv[++i];
  }
  return result;
}

function usage() {
  console.error('Usage: node scripts/validate-pptx-structure.mjs <file.pptx> [--out report.json] [--expected-pages n] [--min-font 7.5] [--visual-review pending|passed|failed] [--strict]');
  process.exit(2);
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) main().catch(error => {
  console.error(`PPTX validation failed: ${error?.message || error}`);
  process.exit(1);
});
