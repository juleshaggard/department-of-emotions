import { createSectors } from '../wheel.js';
import palette from '../reference-palette.json' with { type: 'json' };
import { angerFear } from '../content/anger-fear.js';
import { joyLove } from '../content/joy-love.js';
import { sadnessSurprise } from '../content/sadness-surprise.js';

export const emotionInfo = { ...angerFear, ...joyLove, ...sadnessSurprise };

const sectors = createSectors(palette);
const primaries = sectors.filter(({ ring }) => ring === 0);
const secondaries = sectors.filter(({ ring }) => ring === 1);

export const explorerSectors = sectors.map((sector, index) => {
  const angle = (sector.start + sector.end) / 2;
  const contains = (candidate) => angle >= candidate.start && angle < candidate.end;
  const primary = primaries.find(contains);
  const parent = sector.ring === 2 ? secondaries.find(contains) : null;
  return { ...sector, index, primary, parent, info: emotionInfo[sector.name] };
});

export const families = primaries.map((primary) => ({
  ...primary,
  index: explorerSectors.findIndex((sector) => sector.ring === 0 && sector.name === primary.name),
}));

/** Keep the hovered emotion's ancestors and descendants clear. */
export function isInFocusedBranch(sector, focused) {
  if (sector.primary.name !== focused.primary.name) return false;
  const epsilon = 1e-7;
  const contains = (outer, inner) => outer.start <= inner.start + epsilon
    && outer.end >= inner.end - epsilon;
  return contains(sector, focused) || contains(focused, sector);
}
