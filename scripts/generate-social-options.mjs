import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { annularSector, WHEEL } from '../src/wheel.js';
import { explorerSectors } from '../src/explorer/explorer-data.js';
import { colorForSector, DEFAULT_WHEEL_SETTINGS } from '../src/explorer/wheel-settings.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'public/social/options');
const paper = '#f8f9f3';
const ink = '#25332b';
const muted = '#637069';
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function wheel(x, y, size) {
  const sectors = explorerSectors.map((sector) => {
    const angle = (sector.start + sector.end) / 2;
    const radius = (WHEEL.radii[sector.ring] + WHEEL.radii[sector.ring + 1]) / 2;
    return `<g><path d="${annularSector(WHEEL.radii[sector.ring], WHEEL.radii[sector.ring + 1], sector.start, sector.end)}" fill="${colorForSector(sector, DEFAULT_WHEEL_SETTINGS)}"/><text transform="translate(${WHEEL.center} ${WHEEL.center}) rotate(${angle}) translate(${radius} 0)" font-family="Arial, sans-serif" font-size="46" fill="#292929" text-anchor="middle" dominant-baseline="central">${escape(sector.name)}</text></g>`;
  }).join('');
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="-8 -8 2334 2334">${sectors}<circle cx="1159" cy="1159" r="120" fill="#ffffff"/></svg>`;
}

const text = (value, x, y, size, centered = false, family = 'Gilda Display', color = ink) => `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="400" fill="${color}"${centered ? ' text-anchor="middle"' : ''}>${escape(value)}</text>`;
const frame = (title, background, content) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><title>${title}</title><rect width="1200" height="630" fill="${background}"/>${content}</svg>`;
const markSource = await fs.readFile(path.join(root, 'public/favicon.svg'), 'utf8');
const mark = markSource.replace(/^[\s\S]*?<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const markViewBox = markSource.match(/viewBox="([^"]+)"/)[1];
const options = [
  {
    name: '01-editorial',
    title: 'Editorial split',
    svg: frame('Department of Emotions — editorial social preview', paper,
      `${wheel(620, -75, 780)}<svg x="74" y="74" width="42" height="42" viewBox="${markViewBox}">${mark}</svg>`
      + text('Department', 74, 276, 86)
      + text('of Emotions', 74, 373, 86)
      + text('departmentofemotions.com', 74, 552, 20, false, 'Arial', muted)),
  },
  {
    name: '02-pastel-poster',
    title: 'Pastel poster',
    svg: frame('Department of Emotions — pastel poster social preview', '#e9e5f2',
      wheel(50, 205, 1100)
      + text('Department of Emotions', 600, 110, 70, true)
      + text('departmentofemotions.com', 600, 157, 19, true, 'Arial', muted)),
  },
  {
    name: '03-quiet-seal',
    title: 'Quiet seal',
    svg: frame('Department of Emotions — centered social preview', paper,
      wheel(409, 40, 382)
      + text('Department of Emotions', 600, 515, 64, true)
      + text('departmentofemotions.com', 600, 572, 19, true, 'Arial', muted)),
  },
];

await fs.mkdir(output, { recursive: true });
const rendererFlag = process.argv.indexOf('--renderer');
const renderer = rendererFlag >= 0
  ? await import(pathToFileURL(path.resolve(process.argv[rendererFlag + 1])).href)
  : null;
for (const option of options) {
  await fs.writeFile(path.join(output, `${option.name}.svg`), option.svg);
  if (renderer) {
    const image = new renderer.Resvg(option.svg, {
      font: {
        loadSystemFonts: false,
        fontFiles: [path.join(root, 'public/fonts/GildaDisplay-Regular.ttf'), '/System/Library/Fonts/Supplemental/Arial.ttf'],
        defaultFontFamily: 'Arial',
      },
    }).render();
    await fs.writeFile(path.join(output, `${option.name}.png`), image.asPng());
  }
  console.log(`${option.title}: ${path.join(output, option.name)}${renderer ? '.png + .svg' : '.svg'}`);
}
