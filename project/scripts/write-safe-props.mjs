#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import {
  compactJson,
  getLayoutRecord,
  getPreferredMediaSlot,
  isDeckLocalMediaSource,
  normalizeProps,
  typedMediaItemForSource,
  unknownPropKeys,
} from './skill-workflow-utils.mjs';
import { validateGoalSpec, validateHtmlStringBoundaries } from './validate-goal-spec.mjs';
import { isMediaArrayKey } from '../src/prop-contract-core.mjs';

const ALLOWED_MEDIA_ITEM_FIELDS = new Set(['src', 'kind', 'type', 'ar', 'ratio', 'poster']);

const argv = process.argv.slice(2);

if (argv.includes('--help') || argv.includes('-h')) {
  printUsage();
  process.exit(0);
}

if (argv[0] === '--goal') {
  runGoal(argv[1], parseGoalOptions(argv.slice(2)));
} else {
  runSingle(argv);
}

function runSingle(args) {
  const [layout, propsArg, ...extraArgs] = args;
  if (!layout || !propsArg) {
    printUsage();
    process.exit(2);
  }

  let props;
  try {
    const source = propsArg.trim().startsWith('{') || propsArg.trim().startsWith('[')
      ? propsArg
      : readFileSync(propsArg, 'utf8');
    props = JSON.parse(source);
  } catch (error) {
    console.error(`Invalid props JSON: ${error.message}`);
    process.exit(2);
  }

  const mediaInput = parseMediaInput(extraArgs);
  const mediaInputErrors = validateMediaInput(mediaInput);
  if (mediaInputErrors.length) {
    process.stdout.write(compactJson({
      layout,
      props,
      warnings: [],
      errors: mediaInputErrors,
    }));
    process.exit(1);
  }

  let mediaIntent = null;
  let mediaMapping = null;

  if (mediaInput.items.length) {
    const slot = getPreferredMediaSlot(layout, { kind: mediaInput.kind, count: mediaInput.items.length });
    if (!slot) {
      process.stdout.write(compactJson({
        layout,
        props,
        warnings: [],
        errors: [`Layout "${layout}" has no media slot that can hold ${mediaInput.items.length} item(s)`],
      }));
      process.exit(1);
    }
    const writeKey = mediaSlotWriteKey(slot);
    props = {
      ...props,
      [writeKey]: mediaInput.items,
      ...(slot.countKey ? { [slot.countKey]: mediaInput.items.length } : {}),
    };
    mediaIntent = mediaInput.kind === 'media' ? 'provided-media' : 'provided-images';
    mediaMapping = {
      field: slot.field,
      fieldPath: slot.fieldPath,
      writableProp: slot.writableProp,
      presetProp: slot.presetProp,
      countKey: slot.countKey,
      count: mediaInput.items.length,
    };
  }

  const record = getLayoutRecord(layout);
  const unknownKeys = record ? unknownPropKeys(record, props) : [];
  const result = normalizeProps(layout, props);
  const unknownErrors = unknownKeys.map(key => `Unknown prop "${key}" for layout "${layout}"`);
  const htmlErrors = [];
  validateHtmlStringBoundaries(props, 'single-layout', layout, 'props', htmlErrors);
  const mediaErrors = validateMediaProps(result.props || props);
  const contractErrors = validateGoalSpec({
    slides: [{
      layout,
      props: result.props || props,
    }],
  }, {
    authoredSpec: {
      slides: [{
        layout,
        props,
      }],
    },
  }).filter(error => error.includes(' field props'));
  const errors = [...new Set([...(result.errors || []), ...unknownErrors, ...htmlErrors, ...mediaErrors, ...contractErrors])];
  process.stdout.write(compactJson({
    layout,
    mediaIntent,
    mediaMapping,
    ...result,
    warnings: result.warnings || [],
    props: unknownKeys.length ? stripKeys(result.props || props, unknownKeys) : result.props,
    publicProps: unknownKeys.length ? stripKeys(result.publicProps || {}, unknownKeys) : result.publicProps,
    errors,
  }));

  if (errors.length) process.exit(1);
}

function runGoal(goalArg, options = {}) {
  if (!goalArg) {
    printUsage();
    process.exit(2);
  }
  let spec;
  try {
    spec = JSON.parse(readFileSync(goalArg, 'utf8'));
  } catch (error) {
    console.error(`Invalid goal JSON: ${error.message}`);
    process.exit(2);
  }

  const slides = Array.isArray(spec.slides) ? spec.slides : [];
  const normalizedSlides = [];
  const slideResults = slides.map((slide, index) => {
    const layout = slide?.layout;
    const normalized = layout
      ? normalizeProps(layout, slide?.props || {})
      : { warnings: [], errors: ['missing layout'] };
    normalizedSlides.push(layout && !normalized.errors?.length
      ? { ...slide, props: normalized.props }
      : slide);
    return {
      slide: index + 1,
      layout: layout || null,
      warningCount: normalized.warnings?.length || 0,
      errorCount: normalized.errors?.length || 0,
      ...(normalized.warnings?.length ? { warnings: normalized.warnings } : {}),
      ...(normalized.errors?.length ? { errors: normalized.errors } : {}),
    };
  });
  const normalizedSpec = Array.isArray(spec.slides) ? { ...spec, slides: normalizedSlides } : spec;
  const goalSpecErrors = validateGoalSpec(normalizedSpec, { authoredSpec: spec });
  const propErrors = slideResults.flatMap(item => (item.errors || []).map(error => `slide ${item.slide} ${item.layout || '<missing>'}: ${error}`));
  const ok = goalSpecErrors.length === 0 && propErrors.length === 0;
  if (ok && options.write) writeFileSync(goalArg, compactJson(normalizedSpec));
  const result = {
    goal: goalArg,
    slideCount: slides.length,
    ok,
    ...(ok && options.write ? { written: goalArg } : {}),
    goalSpecErrorCount: goalSpecErrors.length,
    propErrorCount: propErrors.length,
    warningCount: slideResults.reduce((sum, item) => sum + item.warningCount, 0),
    ...(goalSpecErrors.length ? { goalSpecErrors } : {}),
    ...(propErrors.length ? { propErrors } : {}),
    slides: slideResults,
  };
  process.stdout.write(compactJson(result));
  if (!result.ok) process.exit(1);
}

function printUsage() {
  console.error('Usage:');
  console.error('  node scripts/write-safe-props.mjs <layout> <props-json-or-file> [--images <path...>] [--media <path...>]');
  console.error('  node scripts/write-safe-props.mjs --goal <goal-spec.json> [--write]');
}

function parseMediaInput(args) {
  const result = { kind: null, items: [] };
  for (let index = 0; index < args.length; index += 1) {
    const item = args[index];
    if (item !== '--images' && item !== '--media') continue;
    result.kind = item === '--media' ? 'media' : 'images';
    for (let valueIndex = index + 1; valueIndex < args.length && !args[valueIndex].startsWith('--'); valueIndex += 1) {
      result.items.push(result.kind === 'media' ? typedMediaItemForSource(args[valueIndex]) : args[valueIndex]);
      index = valueIndex;
    }
  }
  return result;
}

function parseGoalOptions(args) {
  return {
    write: args.includes('--write'),
  };
}

function mediaSlotWriteKey(slot) {
  const path = slot.presetProp || slot.writableProp || slot.fieldPath || (slot.field ? `props.${slot.field}` : '');
  const match = /^props\.([A-Za-z_$][\w$]*)$/.exec(String(path || ''));
  return match?.[1] || slot.field;
}

function validateMediaInput(mediaInput) {
  const errors = [];
  for (const [index, item] of mediaInput.items.entries()) {
    const src = typeof item === 'string' ? item : item?.src;
    pushMediaSourceError(src, `--${mediaInput.kind}[${index}]`, errors);
  }
  return errors;
}

function validateMediaProps(props = {}) {
  const errors = [];
  for (const [key, value] of Object.entries(props || {})) {
    if (!isMediaArrayKey(key) || !Array.isArray(value)) continue;
    value.forEach((item, index) => validateMediaItem(item, `props.${key}[${index}]`, errors));
  }
  return errors;
}

function validateMediaItem(item, field, errors) {
  if (typeof item === 'string') {
    pushMediaSourceError(item, field, errors);
    return;
  }
  if (!item || typeof item !== 'object' || Array.isArray(item)) return;
  const unknownFields = Object.keys(item).filter(key => !ALLOWED_MEDIA_ITEM_FIELDS.has(key));
  if (unknownFields.length) {
    errors.push(`${field}: unknown media item field(s): ${unknownFields.join(', ')}; allowed fields: ${[...ALLOWED_MEDIA_ITEM_FIELDS].join(', ')}`);
  }
  pushMediaSourceError(item.src, `${field}.src`, errors);
  if (typeof item.poster === 'string') pushMediaSourceError(item.poster, `${field}.poster`, errors);
}

function pushMediaSourceError(src, field, errors) {
  const text = String(src || '').trim();
  if (!text || isDeckLocalMediaSource(text)) return;
  errors.push(`${field}: media source "${text}" must be staged into the deck under assets/user-media/ and referenced by normalized POSIX relative path; traversal, loose relative paths, absolute local paths, file:// URLs, remote http(s) URLs, and data: media are not allowed`);
}

function stripKeys(value, keys) {
  const blocked = new Set(keys);
  return Object.fromEntries(Object.entries(value || {}).filter(([key]) => !blocked.has(key)));
}
