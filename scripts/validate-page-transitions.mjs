#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import https from 'node:https';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TEMPLATE = path.join(ROOT, 'assets/template-swiss.html');
const PREVIEW_INDEX = path.join(ROOT, 'output/theme-preview/ppt/index.html');
const ARTIFACT_ROOT = path.join(ROOT, 'output/page-transition-validation/latest');
const CHROME_PATH = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const cliUrl = getArg('--url');
const REQUIRED_MODES = [
  { value: 'pixelReveal', family: 'codrops/PixelTransition demo 1 row-random grid', type: 'pixel', reference: 'codrops/PixelTransition', variant: 'demo1-row-grid', minRows: 8, minColumns: 14, minCells: 112, axis: 'scale' },
  { value: 'pixelStretch', family: 'codrops/PixelTransition demo 2 side stretch grid', type: 'pixel', reference: 'codrops/PixelTransition', variant: 'demo2-side-stretch', minRows: 9, minColumns: 17, minCells: 153, axis: 'scale' },
  { value: 'pixelZoom', family: 'codrops/PixelTransition demo 3 center zoom grid', type: 'pixel', reference: 'codrops/PixelTransition', variant: 'demo3-center-zoom', minRows: 7, minColumns: 13, minCells: 91, axis: 'scale' },
  { value: 'pixelTight', family: 'codrops/PixelTransition demo 4 dense zoom grid', type: 'pixel', reference: 'codrops/PixelTransition', variant: 'demo4-dense-zoom', minRows: 9, minColumns: 17, minCells: 153, axis: 'scale' },
  { value: 'pixelBarsY', family: 'codrops/PixelTransition demo 5 vertical bar cells', type: 'pixel', reference: 'codrops/PixelTransition', variant: 'demo5-vertical-bars', minRows: 20, minColumns: 4, minCells: 80, axis: 'scaleY' },
  { value: 'pixelBarsX', family: 'codrops/PixelTransition demo 6 horizontal bar cells', type: 'pixel', reference: 'codrops/PixelTransition', variant: 'demo6-horizontal-bars', minRows: 6, minColumns: 11, minCells: 66, axis: 'scaleX' },
  { value: 'sliceReveal', family: 'codrops/SliceRevealer demo 1 mixed cover/uncover', type: 'slice', reference: 'codrops/SliceRevealer', variant: 'demo1-mixed-origins', minSlices: 7 },
  { value: 'sliceHorizontal', family: 'codrops/SliceRevealer demo 2 horizontal sequence', type: 'slice', reference: 'codrops/SliceRevealer', variant: 'demo2-horizontal-sequence', minSlices: 8, orientation: 'horizontal' },
  { value: 'sliceGallery', family: 'codrops/SliceRevealer demo 3 gallery stagger', type: 'slice', reference: 'codrops/SliceRevealer', variant: 'demo3-gallery-stagger', minSlices: 16 },
  { value: 'canvasWipe', family: 'akella/videoTransitions demo 1 circle texture mix', type: 'texture', reference: 'akella/videoTransitions', variant: 'demo1-circle', effect: 'circle' },
  { value: 'videoBands', family: 'akella/videoTransitions demo 2 striped slide texture mix', type: 'texture', reference: 'akella/videoTransitions', variant: 'demo2-bands', effect: 'bands' },
  { value: 'videoDisplace', family: 'akella/videoTransitions demo 3 grid displacement texture mix', type: 'texture', reference: 'akella/videoTransitions', variant: 'demo3-displace', effect: 'displace' },
  { value: 'videoZoom', family: 'akella/videoTransitions demo 4 cross-zoom texture mix', type: 'texture', reference: 'akella/videoTransitions', variant: 'demo4-cross-zoom', effect: 'crossZoom' },
  { value: 'videoRotate', family: 'akella/videoTransitions demo 5 rotating wipe texture mix', type: 'texture', reference: 'akella/videoTransitions', variant: 'demo5-rotate-wipe', effect: 'rotateWipe' },
  { value: 'containerClip', family: 'blenkcode/codrops-demo default clip movement', type: 'container', reference: 'blenkcode/codrops-demo', variant: 'default-clip' },
  { value: 'containerSlide', family: 'blenkcode/codrops-demo alternative horizontal movement', type: 'container', reference: 'blenkcode/codrops-demo', variant: 'alternative-slide' },
];

if (!existsSync(CHROME_PATH)) {
  throw new Error(`Chrome executable not found: ${CHROME_PATH}
Set CHROME_PATH to a local Chrome/Chromium executable and rerun the validation.`);
}

if (!cliUrl && !existsSync(PREVIEW_INDEX)) {
  throw new Error(`Preview file missing: ${PREVIEW_INDEX}
Run npm run render:themes first, or pass --url to an existing preview.`);
}

rmSync(ARTIFACT_ROOT, { recursive: true, force: true });
mkdirSync(ARTIFACT_ROOT, { recursive: true });

const staticChecks = runStaticChecks();
const server = cliUrl ? null : await startPreviewServer();
const url = cliUrl || server.url;
const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
let page;

try {
  page = await browser.newPage({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
  page.setDefaultTimeout(30000);
  const consoleErrors = [];
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', error => {
    consoleErrors.push(error.message);
  });
  await page.addInitScript(() => localStorage.clear());
  await page.goto(`${url}${url.includes('?') ? '&' : '?'}page_transitions=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#deck > .slide.active, #deck > .slide[data-deck-active]');
  await settle(page, 500);

  const options = await readTransitionOptions(page);
  const setMode = [];
  const lifecycles = [];
  for (const mode of REQUIRED_MODES) {
    setMode.push(await probeSetMode(page, mode.value));
    lifecycles.push(await runModeTransition(page, mode.value));
  }
  const rapidNavigation = await runRapidNavigation(page);
  const noneMode = await runDirectNavigation(page, 'none');
  const reducedMotion = await runReducedMotionNavigation(page);
  const result = {
    url,
    passed: false,
    artifactRoot: ARTIFACT_ROOT,
    contactSheet: path.join(ARTIFACT_ROOT, 'contact-sheet.html'),
    staticChecks,
    options,
    setMode,
    lifecycles,
    rapidNavigation,
    noneMode,
    reducedMotion,
    consoleErrors,
  };
  const failures = validateResult(result);
  result.passed = failures.length === 0;
  writeArtifacts(result);
  if (failures.length) {
    console.error(JSON.stringify({ ...result, failures }, null, 2));
    throw new Error(failures.join('\n'));
  }
  console.log(JSON.stringify(result, null, 2));
} finally {
  await closePage(page);
  await closeBrowser(browser);
  if (server) await server.close();
}

function runStaticChecks() {
  const html = readFileSync(TEMPLATE, 'utf8');
  const selectSource = sliceBetween(html, '<select id="preview-transition">', '</select>');
  const options = [...selectSource.matchAll(/<option\s+value=["']([^"']+)["']/g)].map(match => match[1]);
  const failures = [];
  for (const mode of REQUIRED_MODES) {
    if (!options.includes(mode.value)) failures.push(`Template transition select is missing ${mode.family} mode "${mode.value}".`);
  }
  if (!options.includes('none')) failures.push('Template transition select is missing existing "none" mode.');
  if (!options.includes('liquidMorph')) failures.push('Template transition select is missing existing "liquidMorph" mode.');
  if (!/transitionReference/.test(html)) failures.push('Transition runtime does not mark stages with reference-specific mechanisms.');
  if (!/transitionVariant/.test(html)) failures.push('Transition runtime does not expose demo-specific variants.');
  return { options, failures };
}

async function readTransitionOptions(page) {
  return page.evaluate(() => {
    const select = document.getElementById('preview-transition');
    return [...(select?.options || [])].map(option => ({
      value: option.value,
      label: (option.textContent || '').trim(),
    }));
  });
}

async function probeSetMode(page, mode) {
  return page.evaluate(mode => {
    window.__setPageTransition?.(mode);
    return {
      mode,
      stored: window.__getPageTransition?.() || '',
      global: window.__pageTransitionMode || '',
    };
  }, mode);
}

async function runModeTransition(page, mode) {
  await resetToIndex(page, 0);
  const selection = await selectTransitionMode(page, mode);
  await page.evaluate(() => {
    window.__pageTransitionValidation = { commitCount: 0 };
    window.__pageTransitionValidation.onChange = () => {
      window.__pageTransitionValidation.commitCount += 1;
    };
    addEventListener('swiss-slide-change', window.__pageTransitionValidation.onChange);
    window.go?.(1, { skipThumbPause: true });
  });
  await page.waitForTimeout(40);
  const earlyStage = await readStageState(page);
  await page.waitForTimeout(430);
  const midStage = await readStageState(page);
  const screenshot = await captureStageScreenshot(page, mode, midStage.stageRect);
  await waitForStageGone(page, 2600);
  const final = await page.evaluate(() => {
    const commitCount = window.__pageTransitionValidation?.commitCount || 0;
    if (window.__pageTransitionValidation?.onChange) {
      removeEventListener('swiss-slide-change', window.__pageTransitionValidation.onChange);
    }
    delete window.__pageTransitionValidation;
    return {
      currentIndex: window.__currentSlideIndex || 0,
      stageCountAfter: document.querySelectorAll('.page-transition-stage').length,
      transitionRoleCountAfter: document.querySelectorAll('[data-transition-role]').length,
      commitCount,
    };
  });
  return {
    mode,
    selection,
    initialIndex: 0,
    targetIndex: 1,
    earlyStage,
    midStage,
    screenshot,
    ...final,
  };
}

async function runRapidNavigation(page) {
  const mode = REQUIRED_MODES[0].value;
  await resetToIndex(page, 0);
  const selection = await selectTransitionMode(page, mode);
  return page.evaluate(async mode => {
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const waitFor = async (predicate, timeoutMs) => {
      const deadline = performance.now() + timeoutMs;
      while (performance.now() < deadline) {
        if (predicate()) return true;
        await wait(40);
      }
      return predicate();
    };
    const visible = window.__getVisibleSlides?.() || [...document.querySelectorAll('#deck > .slide:not([hidden])')];
    const targetIndex = Math.min(3, Math.max(1, visible.length - 1));
    let commitCount = 0;
    const onChange = () => { commitCount += 1; };
    addEventListener('swiss-slide-change', onChange);
    for (let index = 1; index <= targetIndex; index += 1) {
      window.go?.(index, { skipThumbPause: true });
      await wait(45);
    }
    await waitFor(() => !document.querySelector('.page-transition-stage'), 2200);
    removeEventListener('swiss-slide-change', onChange);
    return {
      mode,
      targetIndex,
      currentIndex: window.__currentSlideIndex || 0,
      commitCount,
      stageCountAfter: document.querySelectorAll('.page-transition-stage').length,
      transitionRoleCountAfter: document.querySelectorAll('[data-transition-role]').length,
    };
  }, mode).then(result => ({ ...result, selection }));
}

async function runDirectNavigation(page, mode) {
  await resetToIndex(page, 0);
  const selection = mode === 'none'
    ? await page.evaluate(() => {
      window.__setPageTransition?.('none');
      const select = document.getElementById('preview-transition');
      if(select) select.value = 'none';
      return { mode: 'none', selectedValue: select?.value || '', stored: window.__getPageTransition?.() || '' };
    })
    : await selectTransitionMode(page, mode);
  return page.evaluate(async mode => {
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    let commitCount = 0;
    const onChange = () => { commitCount += 1; };
    addEventListener('swiss-slide-change', onChange);
    window.go?.(1, { skipThumbPause: true });
    await wait(120);
    removeEventListener('swiss-slide-change', onChange);
    return {
      mode,
      currentIndex: window.__currentSlideIndex || 0,
      commitCount,
      stageCountAfter: document.querySelectorAll('.page-transition-stage').length,
    };
  }, mode).then(result => ({ ...result, selection }));
}

async function selectTransitionMode(page, mode) {
  return page.evaluate(mode => {
    const select = document.getElementById('preview-transition');
    if (!select) {
      window.__setPageTransition?.(mode);
      return { mode, selectedValue: '', stored: window.__getPageTransition?.() || '', hasSelect: false };
    }
    select.value = mode;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return {
      mode,
      selectedValue: select.value,
      stored: window.__getPageTransition?.() || '',
      hasSelect: true,
    };
  }, mode);
}

async function runReducedMotionNavigation(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const result = await runDirectNavigation(page, REQUIRED_MODES[1].value);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  return result;
}

async function resetToIndex(page, index) {
  await page.evaluate(index => {
    document.querySelectorAll('.page-transition-stage').forEach(stage => {
      stage.__transitionCancel?.();
      stage.__transitionTimeline?.kill?.();
      stage.remove();
    });
    window.__setPageTransition?.('none');
    window.go?.(index, { animate: false, force: true, skipThumbPause: true });
  }, index);
  await settle(page, 180);
}

async function readStageState(page) {
  return page.evaluate(() => {
    const stage = document.querySelector('.page-transition-stage');
    const deck = document.getElementById('deck-viewport');
    const stageRect = stage?.getBoundingClientRect();
    const deckRect = deck?.getBoundingClientRect();
    const pixelCells = [...(stage?.querySelectorAll?.('.page-transition-pixel') || [])];
    const sliceCells = [...(stage?.querySelectorAll?.('.page-transition-slice') || [])];
    const textureCanvas = stage?.querySelector?.('canvas[data-transition-texture="true"]') || null;
    const containerCurrent = stage?.querySelector?.('[data-container-role="current"]') || null;
    const containerNext = stage?.querySelector?.('[data-container-role="next"]') || null;
    return {
      exists: Boolean(stage),
      mode: stage?.dataset.transitionMode || '',
      reference: stage?.dataset.transitionReference || '',
      variant: stage?.dataset.transitionVariant || '',
      roleCount: stage?.querySelectorAll?.('[data-transition-role]').length || 0,
      stageRect: rectOf(stageRect),
      deckRect: rectOf(deckRect),
      stageWithinDeck: Boolean(stageRect && deckRect
        && stageRect.left >= deckRect.left - 1
        && stageRect.top >= deckRect.top - 1
        && stageRect.right <= deckRect.right + 1
        && stageRect.bottom <= deckRect.bottom + 1),
      pixel: {
        count: pixelCells.length,
        rows: uniqueCount(pixelCells, 'pixelRow'),
        columns: uniqueCount(pixelCells, 'pixelColumn'),
        phase: stage?.querySelector?.('[data-pixel-cover="true"]')?.dataset.pixelPhase || '',
        axis: stage?.querySelector?.('[data-pixel-cover="true"]')?.dataset.pixelAxis || '',
        colors: uniqueCssValues(pixelCells, 'backgroundColor'),
        coverage: visibleCoverage(pixelCells, stageRect),
      },
      slice: {
        count: sliceCells.length,
        orientation: stage?.querySelector?.('[data-slice-cover="true"]')?.dataset.sliceOrientation || '',
        originShow: stage?.querySelector?.('[data-slice-cover="true"]')?.dataset.sliceOriginShow || '',
        originHide: stage?.querySelector?.('[data-slice-cover="true"]')?.dataset.sliceOriginHide || '',
        variant: stage?.querySelector?.('[data-slice-cover="true"]')?.dataset.sliceVariant || '',
        colors: uniqueCssValues(sliceCells, 'backgroundColor'),
        coverage: visibleCoverage(sliceCells, stageRect),
      },
      texture: {
        exists: Boolean(textureCanvas),
        effect: textureCanvas?.dataset.transitionEffect || '',
        source: textureCanvas?.dataset.textureSource || '',
        frames: Number(textureCanvas?.dataset.transitionFrames || 0),
        hasCurrentTexture: textureCanvas?.dataset.currentTexture === 'true',
        hasNextTexture: textureCanvas?.dataset.nextTexture === 'true',
        width: textureCanvas?.width || 0,
        height: textureCanvas?.height || 0,
      },
      container: {
        variant: stage?.querySelector?.('[data-container-transition="true"]')?.dataset.containerVariant || '',
        hasCurrent: Boolean(containerCurrent),
        hasNext: Boolean(containerNext),
        currentTransform: containerCurrent ? getComputedStyle(containerCurrent).transform : '',
        nextClipPath: containerNext ? getComputedStyle(containerNext).clipPath : '',
        currentOpacity: containerCurrent ? Number(getComputedStyle(containerCurrent).opacity || 0) : 0,
      },
    };

    function rectOf(rect) {
      if (!rect) return null;
      return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
    }
    function uniqueCount(elements, key) {
      return new Set(elements.map(el => el.dataset[key] || '').filter(Boolean)).size;
    }
    function uniqueCssValues(elements, property) {
      return [...new Set(elements.map(el => getComputedStyle(el)[property]).filter(Boolean))];
    }
    function visibleCoverage(elements, rootRect) {
      if (!rootRect?.width || !rootRect?.height || !elements.length) return 0;
      let area = 0;
      for (const el of elements) {
        const style = getComputedStyle(el);
        const opacity = Number(style.opacity || 0);
        if (opacity < 0.18 || style.visibility === 'hidden' || style.display === 'none') continue;
        const rect = el.getBoundingClientRect();
        const width = Math.max(0, Math.min(rect.right, rootRect.right) - Math.max(rect.left, rootRect.left));
        const height = Math.max(0, Math.min(rect.bottom, rootRect.bottom) - Math.max(rect.top, rootRect.top));
        area += width * height * Math.min(1, opacity);
      }
      return area / (rootRect.width * rootRect.height);
    }
  });
}

async function captureStageScreenshot(page, mode, stageRect) {
  const safeMode = mode.replace(/[^a-z0-9_-]/gi, '-');
  const file = path.join(ARTIFACT_ROOT, `${safeMode}-mid.png`);
  const stage = page.locator('.page-transition-stage').first();
  if (await stage.count()) {
    try {
      await stage.screenshot({ path: file });
      return file;
    } catch {}
  }
  if (stageRect?.width && stageRect?.height) {
    try {
      await page.screenshot({
        path: file,
        clip: {
          x: Math.max(0, Math.round(stageRect.left)),
          y: Math.max(0, Math.round(stageRect.top)),
          width: Math.max(1, Math.round(stageRect.width)),
          height: Math.max(1, Math.round(stageRect.height)),
        },
      });
      return file;
    } catch {}
  }
  return '';
}

async function waitForStageGone(page, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const count = await page.locator('.page-transition-stage').count();
    if (count === 0) return true;
    await page.waitForTimeout(50);
  }
  return false;
}

function validateResult(result) {
  const failures = [...(result.staticChecks.failures || [])];
  const optionValues = result.options.map(option => option.value);
  for (const mode of REQUIRED_MODES) {
    if (!optionValues.includes(mode.value)) failures.push(`Runtime transition select is missing ${mode.family} mode "${mode.value}".`);
  }
  for (const probe of result.setMode) {
    if (probe.stored !== probe.mode) failures.push(`__setPageTransition("${probe.mode}") stored "${probe.stored}" instead.`);
  }
  for (const lifecycle of result.lifecycles) {
    if (lifecycle.selection.selectedValue !== lifecycle.mode || lifecycle.selection.stored !== lifecycle.mode) failures.push(`${lifecycle.mode} could not be selected through #preview-transition.`);
    if (!lifecycle.earlyStage.exists && !lifecycle.midStage.exists) failures.push(`${lifecycle.mode} did not create a transition stage.`);
    if (lifecycle.earlyStage.exists && !lifecycle.earlyStage.stageWithinDeck) failures.push(`${lifecycle.mode} transition stage is not confined to the slide stage.`);
    if (lifecycle.commitCount !== 1) failures.push(`${lifecycle.mode} committed ${lifecycle.commitCount} time(s), expected 1.`);
    if (lifecycle.currentIndex !== lifecycle.targetIndex) failures.push(`${lifecycle.mode} finished on slide ${lifecycle.currentIndex}, expected ${lifecycle.targetIndex}.`);
    if (lifecycle.stageCountAfter !== 0) failures.push(`${lifecycle.mode} left ${lifecycle.stageCountAfter} transition stage(s) after completion.`);
    if (lifecycle.transitionRoleCountAfter !== 0) failures.push(`${lifecycle.mode} left ${lifecycle.transitionRoleCountAfter} transition clone(s) after completion.`);
    if (!lifecycle.screenshot) failures.push(`${lifecycle.mode} did not produce a mid-transition screenshot artifact.`);
  }
  for (const config of REQUIRED_MODES) {
    validateModeMechanism(result, config, failures);
  }
  if (result.rapidNavigation.selection.selectedValue !== result.rapidNavigation.mode || result.rapidNavigation.selection.stored !== result.rapidNavigation.mode) failures.push('Rapid navigation mode could not be selected through #preview-transition.');
  if (result.rapidNavigation.currentIndex !== result.rapidNavigation.targetIndex) failures.push(`Rapid navigation ended on slide ${result.rapidNavigation.currentIndex}, expected ${result.rapidNavigation.targetIndex}.`);
  if (result.rapidNavigation.stageCountAfter !== 0) failures.push(`Rapid navigation left ${result.rapidNavigation.stageCountAfter} transition stage(s).`);
  if (result.rapidNavigation.transitionRoleCountAfter !== 0) failures.push(`Rapid navigation left ${result.rapidNavigation.transitionRoleCountAfter} transition clone(s).`);
  if (result.noneMode.currentIndex !== 1 || result.noneMode.stageCountAfter !== 0) failures.push('none mode did not switch directly without a transition stage.');
  if (result.reducedMotion.currentIndex !== 1 || result.reducedMotion.stageCountAfter !== 0) failures.push('Reduced motion did not switch directly without a transition stage.');
  if (result.consoleErrors.length) failures.push(`Console errors were emitted: ${result.consoleErrors.join(' | ')}`);
  return failures;
}

function validateModeMechanism(result, config, failures) {
  const lifecycle = result.lifecycles.find(item => item.mode === config.value);
  const state = lifecycle?.midStage;
  if (!state?.exists) {
    failures.push(`${config.value} did not keep its reference mechanism visible at mid-transition.`);
    return;
  }
  if (state.reference !== config.reference) failures.push(`${config.value} is marked "${state.reference}", expected "${config.reference}".`);
  if (state.variant !== config.variant) failures.push(`${config.value} variant is "${state.variant}", expected "${config.variant}".`);
  if (config.type === 'pixel') validatePixelMode(state, config, failures);
  if (config.type === 'slice') validateSliceMode(state, config, failures);
  if (config.type === 'texture') validateTextureMode(state, config, failures);
  if (config.type === 'container') validateContainerMode(state, config, failures);
}

function validatePixelMode(state, config, failures) {
  if (state.pixel.count < config.minCells) failures.push(`${config.value} uses ${state.pixel.count} cells, expected at least ${config.minCells}.`);
  if (state.pixel.rows < config.minRows || state.pixel.columns < config.minColumns) failures.push(`${config.value} grid is ${state.pixel.rows}x${state.pixel.columns}, expected at least ${config.minRows}x${config.minColumns}.`);
  if (state.pixel.coverage < 0.45) failures.push(`${config.value} grid coverage at mid-transition is ${state.pixel.coverage.toFixed(2)}, expected cells to dominate the frame.`);
  if (state.pixel.phase !== 'cover-uncover') failures.push(`${config.value} does not expose a cover/uncover pixel phase.`);
  if (state.pixel.axis !== config.axis) failures.push(`${config.value} pixel axis is "${state.pixel.axis}", expected "${config.axis}".`);
  if (state.pixel.colors.length !== 1) failures.push(`${config.value} uses mixed pixel colors (${state.pixel.colors.join(', ')}), expected one solid cover color.`);
}

function validateSliceMode(state, config, failures) {
  if (state.slice.count < config.minSlices) failures.push(`${config.value} uses ${state.slice.count} slices, expected at least ${config.minSlices}.`);
  if (config.orientation && state.slice.orientation !== config.orientation) failures.push(`${config.value} orientation is "${state.slice.orientation}", expected "${config.orientation}".`);
  if (state.slice.variant !== config.variant) failures.push(`${config.value} slice variant is "${state.slice.variant}", expected "${config.variant}".`);
  if (!state.slice.orientation || !state.slice.originShow || !state.slice.originHide) failures.push(`${config.value} does not expose orientation/show/hide slice origins.`);
  if (state.slice.colors.length !== 1) failures.push(`${config.value} uses mixed slice colors (${state.slice.colors.join(', ')}), expected one solid cover color.`);
  if (state.slice.coverage < 0.42) failures.push(`${config.value} slice coverage at mid-transition is ${state.slice.coverage.toFixed(2)}, expected slices to actively cover/reveal the slide.`);
}

function validateTextureMode(state, config, failures) {
  if (!state.texture.exists) failures.push(`${config.value} does not use a transition texture canvas.`);
  if (state.texture.effect !== config.effect) failures.push(`${config.value} texture effect is "${state.texture.effect}", expected "${config.effect}".`);
  if (state.texture.source !== 'html-to-image') failures.push(`${config.value} texture source is "${state.texture.source}", expected real html-to-image slide capture.`);
  if (!state.texture.hasCurrentTexture || !state.texture.hasNextTexture) failures.push(`${config.value} does not capture both current and next slide textures.`);
  if (state.texture.frames < 4) failures.push(`${config.value} redrew ${state.texture.frames} texture frame(s), expected repeated shader-style redraw.`);
  if (state.texture.width < 480 || state.texture.height < 270) failures.push(`${config.value} texture canvas is too small (${state.texture.width}x${state.texture.height}).`);
}

function validateContainerMode(state, config, failures) {
  if (state.container.variant !== config.variant) failures.push(`${config.value} container variant is "${state.container.variant}", expected "${config.variant}".`);
  if (!state.container.hasCurrent || !state.container.hasNext) failures.push(`${config.value} does not use explicit current/next transition containers.`);
  if (config.variant === 'default-clip' && (!state.container.nextClipPath || state.container.nextClipPath === 'none')) failures.push(`${config.value} next container does not use clip-path reveal.`);
  if (!state.container.currentTransform || state.container.currentTransform === 'none') failures.push(`${config.value} current container is not moving/scaling during the transition.`);
  if (state.container.currentOpacity > 0.75) failures.push(`${config.value} current container is not dimmed during the transition.`);
}

function writeArtifacts(result) {
  writeFileSync(path.join(ARTIFACT_ROOT, 'result.json'), `${JSON.stringify(result, null, 2)}\n`);
  const cards = result.lifecycles.map(item => {
    const relative = item.screenshot ? path.basename(item.screenshot) : '';
    const image = relative ? `<img src="./${relative}" alt="${item.mode} mid-transition">` : '<div class="missing">No screenshot</div>';
    return `<section><h2>${item.mode}</h2>${image}<pre>${escapeHtml(JSON.stringify(item.midStage, null, 2))}</pre></section>`;
  }).join('\n');
  writeFileSync(path.join(ARTIFACT_ROOT, 'contact-sheet.html'), `<!doctype html>
<meta charset="utf-8">
<title>Page Transition Validation Contact Sheet</title>
<style>
body{margin:0;padding:24px;background:#111;color:#eee;font:14px system-ui,sans-serif}
main{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:20px}
section{border:1px solid #333;background:#181818;padding:14px}
h1,h2{margin:0 0 12px}
img{display:block;width:100%;aspect-ratio:16/9;object-fit:contain;background:#000}
pre{max-height:240px;overflow:auto;font-size:11px;line-height:1.35;color:#bbb}
.missing{display:grid;place-items:center;aspect-ratio:16/9;background:#280b0b;color:#ffb4b4}
</style>
<h1>Page Transition Validation Contact Sheet</h1>
<main>${cards}</main>
`);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

async function settle(page, ms = 180) {
  await page.waitForTimeout(ms);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

function sliceBetween(source, start, end) {
  const startIndex = source.indexOf(start);
  if (startIndex < 0) return '';
  const endIndex = source.indexOf(end, startIndex + start.length);
  return endIndex < 0 ? source.slice(startIndex + start.length) : source.slice(startIndex + start.length, endIndex);
}

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : '';
}

async function startPreviewServer() {
  const port = await getFreePort();
  const child = spawn(process.execPath, ['scripts/serve-preview-https.mjs', 'output/theme-preview/ppt', String(port)], {
    cwd: ROOT,
    env: { ...process.env, HOST: '127.0.0.1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', chunk => { output += chunk.toString(); });
  child.stderr.on('data', chunk => { output += chunk.toString(); });
  const previewUrl = `https://127.0.0.1:${port}/`;
  await waitForServer(previewUrl, child, () => output);
  return {
    url: previewUrl,
    close: () => new Promise(resolve => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };
      child.once('exit', finish);
      child.kill('SIGTERM');
      setTimeout(() => {
        if (!done) child.kill('SIGKILL');
        finish();
      }, 1500).unref();
    }),
  };
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      server.close(() => resolve(port));
    });
  });
}

async function waitForServer(previewUrl, child, getOutput) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Preview server exited early:\n${getOutput()}`);
    if (await canOpen(previewUrl)) return;
    await new Promise(resolve => setTimeout(resolve, 120));
  }
  throw new Error(`Preview server did not become ready:\n${getOutput()}`);
}

function canOpen(previewUrl) {
  return new Promise(resolve => {
    const req = https.get(previewUrl, { rejectUnauthorized: false }, response => {
      response.resume();
      resolve(Boolean(response.statusCode && response.statusCode < 500));
    });
    req.on('error', () => resolve(false));
    req.setTimeout(800, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function closePage(page) {
  if (!page) return;
  await page.close().catch(() => {});
}

async function closeBrowser(browser) {
  await browser.close().catch(() => {});
}
