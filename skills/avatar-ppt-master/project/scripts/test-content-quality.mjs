#!/usr/bin/env node
import { getLayoutRecord } from './skill-workflow-utils.mjs';
import { validateGoalSpec } from './validate-goal-spec.mjs';

const slide = layout => ({
  layout,
  props: structuredClone(getLayoutRecord(layout)?.page?.defaultProps || {}),
});

const validLayouts = [
  'theme13_page001',
  'theme13_page003',
  'theme13_page025',
  'theme13_page026',
  'theme13_page028',
  'theme13_page029',
  'theme13_page030',
  'theme13_page016',
];

const valid = {
  title: '语义校验回归',
  goal: '验证图表准入与视觉节奏规则',
  themePack: 'theme13',
  pageCount: validLayouts.length,
  slides: validLayouts.map(slide),
};

const validErrors = validateGoalSpec(valid);
assert(validErrors.length === 0, `valid fixture failed:\n${validErrors.join('\n')}`);

const invalid = structuredClone(valid);
invalid.slides[2].props.points = [
  { label: '类别 A', value: 8 },
  { label: '类别 B', value: 6 },
  { label: '类别 C', value: 3 },
  { label: '综合覆盖', value: 17 },
];
invalid.slides[2].props.itemCount = 4;
invalid.slides[3].props.centerValue = '↓';
invalid.slides[4].props.unit = '';
invalid.slides[4].props.steps = invalid.slides[4].props.steps.map(({ type, ...step }) => step);
invalid.slides[5].props.items = invalid.slides[5].props.items.map((item, index) => ({
  ...item,
  scoreX: index + 1,
  scoreY: index + 1,
  size: index + 1,
}));
invalid.slides[6].props.stages = invalid.slides[6].props.stages.map((item, index) => ({ ...item, value: index + 1 }));

const invalidErrors = validateGoalSpec(invalid);
for (const expected of [
  'line chart ends with aggregate',
  'donut center must state a verifiable whole',
  'waterfall requires one explicit shared unit',
  'quadrant bubble size must stay within 12-40',
  'funnel values must be monotonically non-increasing',
]) {
  assert(invalidErrors.some(error => error.includes(expected)), `missing expected error: ${expected}`);
}

const cardHeavyLayouts = [
  'theme13_page001',
  'theme13_page004',
  'theme13_page017',
  'theme13_page009',
  'theme13_page008',
  'theme13_page010',
  'theme13_page005',
  'theme13_page018',
  'theme13_page016',
];
const cardHeavy = {
  title: '卡片密度回归',
  goal: '验证连续卡片页会被拦截',
  themePack: 'theme13',
  pageCount: cardHeavyLayouts.length,
  slides: cardHeavyLayouts.map(slide),
};
const cardErrors = validateGoalSpec(cardHeavy);
assert(cardErrors.some(error => error.includes('card-dominant slides occupy')), 'missing card ratio error');
assert(cardErrors.some(error => error.includes('3 consecutive body slides')), 'missing consecutive card error');

console.log('Content quality regression passed.');

function assert(condition, message) {
  if (condition) return;
  console.error(message);
  process.exit(1);
}
