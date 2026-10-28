#!/usr/bin/env node
import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseSegments = (process.env.PAGES_BASE_PATH || '/').trim().split('/').filter(Boolean);
const base = baseSegments.length ? `/${baseSegments.join('/')}/` : '/';
const output = path.join(root, 'dist/pages');

await build({ root, base, build: { outDir: output } });

await Promise.all(['explore', 'wheel', 'privacy', 'wheels'].map(async (route) => {
  const directory = path.join(output, route);
  await mkdir(directory, { recursive: true });
  await copyFile(path.join(output, 'index.html'), path.join(directory, 'index.html'));
}));

console.log(`Prepared GitHub Pages build: dist/pages (base ${base})`);
