#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildClientRuntimeFromModules,
  buildThemeModule,
  prebuiltBundlePath,
  THEME_RUNTIME_DIR,
} from '../src/components/themes/runtime-build.mjs';
import { normalizeThemeKeys } from '../src/components/themes/theme-registry-codegen.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const keys = normalizeThemeKeys(process.argv.slice(2));
if (!keys.length) {
  console.error('Usage: node scripts/build-theme-runtime.mjs <theme-key...>');
  process.exit(2);
}
const outDir = path.join(root, THEME_RUNTIME_DIR);
for (const key of keys) {
  const runtime = path.join(root, 'src/components/themes', key, 'runtime.jsx');
  if (!fs.existsSync(runtime)) throw new Error(`Theme runtime missing: ${runtime}`);
  const moduleFile = buildThemeModule({ root, themeKey: key, outDir });
  const bundleFile = prebuiltBundlePath(root, key);
  buildClientRuntimeFromModules({ root, outFile: bundleFile, themeKeys: [key], moduleDir: outDir });
  console.log(`Built ${path.relative(root, moduleFile)} and ${path.relative(root, bundleFile)}`);
}
