#!/usr/bin/env node
import { mkdtempSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pptxgen from 'pptxgenjs';
import {
  buildContentLock,
  validateCompositionPlan,
  validateContentLock,
  validateEvidenceLedger,
} from './quality-core.mjs';
import { validatePptxStructure } from './validate-pptx-structure.mjs';

const evidence = {
  version: '1.0',
  items: [{
    id: 'E01',
    claim: '试点处理时长下降',
    value: 18,
    unit: '%',
    period: '2026 Q2 试点',
    source: { type: 'calculation', label: '试点测算表', location: 'sheet:summary!B12' },
    confidence: 'medium',
    caveat: '样本量有限',
    implication: '可进入扩大验证阶段',
    recommendedVisual: 'before-after bar',
  }],
};
const plan = {
  mode: 'evidence',
  pages: [{
    page: 1,
    pageJob: 'evidence',
    relationship: 'before-after',
    messageTitle: '试点验证显示处理时长下降 18%',
    visualTranslation: 'before-after bar with source note',
    visualFamily: 'chart',
    primaryFocus: '18%',
    insightStrip: '效率改善已出现，但仍需扩大样本',
    imagePolicy: 'CSS/SVG only',
    scrRole: 'resolution',
    evidenceIds: ['E01'],
    caveat: '样本量有限',
    soWhat: '扩大验证而不是直接全量推广',
    densityTarget: 'balanced',
    componentInventory: ['title', 'bar chart', 'source note', 'insight strip'],
  }],
};
const goal = { title: '质量流水线测试', pageCount: 1, slides: [{ layout: 'theme13_page025', props: { title: '试点验证' } }] };

const evidenceResult = validateEvidenceLedger(evidence);
assert(!evidenceResult.errors.length, evidenceResult.errors.join('\n'));
const planResult = validateCompositionPlan(plan, { expectedPages: 1, evidenceIds: evidenceResult.ids });
assert(!planResult.errors.length, planResult.errors.join('\n'));

const lock = buildContentLock({ goal, plan, evidence });
assert(!validateContentLock(lock, { goal, plan, evidence }).errors.length, 'fresh content lock must validate');
const changedPlan = structuredClone(plan);
changedPlan.pages[0].messageTitle = '内容被静默修改';
assert(validateContentLock(lock, { goal, plan: changedPlan, evidence }).errors.some(error => error.includes('compositionPlan changed')), 'content drift must be detected');

const dir = mkdtempSync(path.join(tmpdir(), 'avatar-ppt-qa-'));
writeJson(path.join(dir, 'goal.json'), goal);
writeJson(path.join(dir, 'composition-plan.json'), plan);
writeJson(path.join(dir, 'evidence-ledger.json'), evidence);
writeJson(path.join(dir, 'content-lock.json'), lock);
const qualityCli = spawnSync(process.execPath, [path.join(path.dirname(fileURLToPath(import.meta.url)), 'validate-quality-inputs.mjs'), '--goal', path.join(dir, 'goal.json')], { encoding: 'utf8' });
assert(qualityCli.status === 0, `${qualityCli.stdout}\n${qualityCli.stderr}`);

const pptxFile = path.join(dir, 'editable.pptx');
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
const slide = pptx.addSlide();
slide.addText('可编辑信息层', { x: 0.7, y: 0.6, w: 5.5, h: 0.5, fontSize: 24 });
slide.addShape(pptx.ShapeType.rect, { x: 0.7, y: 1.4, w: 4.2, h: 1.2, fill: { color: 'E8F5F4' }, line: { color: '159C95' } });
slide.addText('18%', { x: 1, y: 1.65, w: 1.5, h: 0.5, fontSize: 28, bold: true });
await pptx.writeFile({ fileName: pptxFile });
const pptxResult = await validatePptxStructure(pptxFile, { expectedPages: 1, visualReview: 'passed' });
assert(!pptxResult.errors.length, pptxResult.errors.join('\n'));
assert(pptxResult.gates.editableInformationLayer.status === 'passed', 'editable information gate must pass');
assert(pptxResult.gates.finalDeliveryReady === true, 'dual gate must pass after visual review');
writeFileSync(path.join(dir, 'report.json'), `${JSON.stringify(pptxResult, null, 2)}\n`);

console.log('Evidence, content-lock and PPTX structure regression passed.');

function assert(condition, message) {
  if (condition) return;
  console.error(message);
  process.exit(1);
}

function writeJson(file, value) {
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}
