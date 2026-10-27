import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createEmotionWheelSvg } from '../src/wheel.js';

const root = new URL('../', import.meta.url);
const palette = JSON.parse(await readFile(new URL('src/reference-palette.json', root), 'utf8'));
const svg = createEmotionWheelSvg({ palette });

await mkdir(new URL('exports/', root), { recursive: true });
await writeFile(new URL('exports/emotion-wheel.svg', root), svg);
await writeFile(new URL('exports/emotion-wheel.html', root), `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Emotion &amp; Feeling Wheel</title>
  <style>
    body { margin: 0; background: white; }
    main { width: min(100%, calc(100svh * 2318 / 2372)); margin-inline: auto; }
    svg { display: block; width: 100%; height: auto; }
    @media print { @page { size: portrait; margin: 0; } main { width: 100%; } }
  </style>
</head>
<body><main>${svg}</main></body>
</html>
`);
console.log(`Exported standalone SVG and HTML to ${fileURLToPath(new URL('exports/', root))}`);
