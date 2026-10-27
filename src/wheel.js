import { emotions } from './emotions.js';

export const WHEEL = {
  width: 2318,
  height: 2372,
  center: 1159,
  radii: [120, 407, 771, 1157],
  // Put the center of "Shocked" exactly on the right-hand horizontal spoke.
  startAngle: -119.11764705882354,
};

const secondaryCount = emotions.reduce((sum, emotion) => sum + emotion.children.length, 0);
const sectorAngle = 360 / secondaryCount;
const radians = (degrees) => degrees * Math.PI / 180;
const number = (value) => Number(value.toFixed(4));
const xml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
}[character]));

function point(radius, angle) {
  return [
    number(WHEEL.center + radius * Math.cos(radians(angle))),
    number(WHEEL.center + radius * Math.sin(radians(angle))),
  ].join(' ');
}

/** A true annular sector, so the exported graphic stays sharp at any size. */
export function annularSector(innerRadius, outerRadius, start, end) {
  const largeArc = end - start > 180 ? 1 : 0;
  return [
    `M ${point(outerRadius, start)}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${point(outerRadius, end)}`,
    `L ${point(innerRadius, end)}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${point(innerRadius, start)}`,
    'Z',
  ].join(' ');
}

export function createSectors(palette) {
  const sectors = [];
  let secondaryIndex = 0;

  emotions.forEach((primary, primaryIndex) => {
    const primaryStart = WHEEL.startAngle + secondaryIndex * sectorAngle;
    const primaryEnd = primaryStart + primary.children.length * sectorAngle;
    sectors.push({
      name: primary.name,
      ring: 0,
      start: primaryStart,
      end: primaryEnd,
      color: palette.primary[primaryIndex],
    });

    primary.children.forEach(([secondary, children]) => {
      const start = WHEEL.startAngle + secondaryIndex * sectorAngle;
      sectors.push({
        name: secondary,
        ring: 1,
        start,
        end: start + sectorAngle,
        color: palette.secondary[secondaryIndex],
      });

      children.forEach((name, childIndex) => {
        const childStart = start + childIndex * sectorAngle / children.length;
        sectors.push({
          name,
          ring: 2,
          start: childStart,
          end: childStart + sectorAngle / children.length,
          color: palette.tertiary[secondaryIndex * 2 + childIndex],
        });
      });
      secondaryIndex += 1;
    });
  });
  return sectors;
}

/**
 * Pure, framework-independent SVG generator.
 * All label baselines point OUTWARD: rotate by the sector's angle, without
 * flipping left-side labels. Thus the first letter is always nearest the hub.
 */
export function createEmotionWheelSvg({ palette }) {
  const sectors = createSectors(palette);
  const description = emotions.map((primary) =>
    `${primary.name}: ${primary.children.map(([secondary, children]) =>
      `${secondary} (${children.join(', ')})`).join('; ')}`).join('. ');

  const cells = sectors.map(({ name, ring, start, end, color }) => {
    const angle = (start + end) / 2;
    const radius = (WHEEL.radii[ring] + WHEEL.radii[ring + 1]) / 2;
    return `<g class="emotion" data-ring="${ring}" data-emotion="${xml(name)}">
      <path d="${annularSector(WHEEL.radii[ring], WHEEL.radii[ring + 1], start, end)}" fill="${xml(color)}"/>
      <text class="emotion-label" data-angle="${number(angle)}" transform="translate(${WHEEL.center} ${WHEEL.center}) rotate(${number(angle)}) translate(${radius} 0)" x="0" y="0" text-anchor="middle" dominant-baseline="central">${xml(name)}</text>
    </g>`;
  }).join('\n');

  const primaryDividers = sectors.filter(({ ring }) => ring === 0)
    .map(({ start }) => `<path d="M ${point(WHEEL.radii[0], start)} L ${point(WHEEL.radii.at(-1), start)}"/>`)
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WHEEL.width}" height="${WHEEL.height}" viewBox="0 0 ${WHEEL.width} ${WHEEL.height}" role="img" aria-labelledby="wheel-title wheel-description">
    <title id="wheel-title">Emotion &amp; Feeling Wheel</title>
    <desc id="wheel-description">Six core emotions, 34 secondary emotions, and 68 specific feelings. All wheel labels read radially outward, with their first letter toward the center. ${xml(description)}. Based on the supplied Junto Institute reference.</desc>
    <style>
      .emotion path { stroke: #303030; stroke-width: 4; stroke-linejoin: round; }
      .primary-dividers { fill: none; stroke: #ffffff; stroke-width: 10; pointer-events: none; }
      .emotion-label { font-family: Calibri, Carlito, Arial, sans-serif; font-size: 46px; font-weight: 400; fill: #292929; }
    </style>
    <rect width="2318" height="2372" fill="white"/>
    ${cells}
    <g class="primary-dividers" aria-hidden="true">${primaryDividers}</g>
    <circle cx="1159" cy="1159" r="120" fill="white" stroke="#303030" stroke-width="4"/>
  </svg>`;
}
