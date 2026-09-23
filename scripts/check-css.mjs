#!/usr/bin/env node
// Styling guardrails. Runs before every build (see package.json), so a
// regression fails on Vercel rather than shipping.
//
//   1. No duplicate @keyframes names across global (non-module) CSS files,
//      and every global keyframe carries the aq- prefix.
//   2. Components import only *.module.css — never a plain .css file.
//   3. No colour literal in tailwind.config.js: tokens live in globals.css.
//   4. No opacity modifier off Tailwind's scale in a class string. Tailwind
//      drops those silently, which is how every photo scrim on this site once
//      went missing at the same time.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SCAN = ['app', 'components', 'lib'];
const OPACITY_SCALE = new Set([
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = SCAN.flatMap((d) => walk(join(ROOT, d)));
const rel = (p) => relative(ROOT, p);
const failures = [];

// 1. keyframes in global CSS ------------------------------------------------
const globalCss = files.filter((f) => f.endsWith('.css') && !f.endsWith('.module.css'));
const seenKeyframes = new Map();
for (const f of globalCss) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/@keyframes\s+([\w-]+)/g)) {
    const name = m[1];
    if (!name.startsWith('aq-')) {
      failures.push(`${rel(f)}: global @keyframes "${name}" must be prefixed aq- (or move it into a *.module.css)`);
    }
    if (seenKeyframes.has(name)) {
      failures.push(`duplicate global @keyframes "${name}" in ${rel(f)} and ${rel(seenKeyframes.get(name))} — whichever loads last wins`);
    }
    seenKeyframes.set(name, f);
  }
}

// 2. css imports from components -------------------------------------------
const jsx = files.filter((f) => /\.(jsx?|tsx?)$/.test(f));
for (const f of jsx) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/import\s+(?:[\w$]+\s+from\s+)?['"]([^'"]+\.css)['"]/g)) {
    const spec = m[1];
    const isModule = spec.endsWith('.module.css');
    const isRootGlobals = spec === './globals.css' && rel(f) === 'app/layout.jsx';
    if (!isModule && !isRootGlobals) {
      failures.push(`${rel(f)}: imports "${spec}" — components may only import *.module.css (globals.css is imported once, in app/layout.jsx)`);
    }
  }
}

// 3. tailwind config carries no colour literals ----------------------------
const tw = readFileSync(join(ROOT, 'tailwind.config.js'), 'utf8');
for (const m of tw.matchAll(/#[0-9a-f]{3,8}\b|rgba?\(\s*\d/gi)) {
  const line = tw.slice(0, m.index).split('\n').length;
  failures.push(`tailwind.config.js:${line}: colour literal "${m[0]}" — define it as a token in app/globals.css and reference var(--…)`);
}

// 4. opacity modifiers on the scale ----------------------------------------
for (const f of jsx) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/\b(?:bg|text|border|from|via|to|ring|divide|placeholder|shadow|fill|stroke|outline|accent|caret|decoration)-[a-z][\w-]*\/(\d{1,3})\b/g)) {
    const n = Number(m[1]);
    if (!OPACITY_SCALE.has(n)) {
      const line = src.slice(0, m.index).split('\n').length;
      failures.push(`${rel(f)}:${line}: "${m[0]}" — /${n} is not on Tailwind's opacity scale and generates nothing; use a scale step or /[0.${String(n).padStart(2, '0')}]`);
    }
  }
}

if (failures.length) {
  console.error(`\ncheck-css: ${failures.length} problem${failures.length === 1 ? '' : 's'}\n`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  console.error('');
  process.exit(1);
}

console.log(
  `check-css: ok — ${globalCss.length} global css, ${files.filter((f) => f.endsWith('.module.css')).length} modules, ${jsx.length} source files, ${seenKeyframes.size} global keyframes`
);
