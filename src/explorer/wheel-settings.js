import referencePalette from '../reference-palette.json' with { type: 'json' };
import { emotions } from '../emotions.js';

export const STROKE_CONTROLS = Object.freeze([
  { key: 'outer', label: 'Outer border' },
  { key: 'rings', label: 'Ring lines' },
  { key: 'sectors', label: 'Sector lines' },
  { key: 'primary', label: 'Main separators' },
  { key: 'hub', label: 'Center outline' },
  { key: 'hover', label: 'Hover outline' },
].map(Object.freeze));

export const FAMILY_DEFAULT_COLORS = Object.freeze(Object.fromEntries(
  emotions.map(({ name }, index) => [name, referencePalette.primary[index]]),
));

export const DEFAULT_WHEEL_SETTINGS = Object.freeze({
  strokes: Object.freeze({
    outer: Object.freeze({ width: 4, color: '#303030', opacity: 1 }),
    rings: Object.freeze({ width: 4, color: '#303030', opacity: 1 }),
    sectors: Object.freeze({ width: 4, color: '#303030', opacity: 1 }),
    primary: Object.freeze({ width: 10, color: '#303030', opacity: 1 }),
    hub: Object.freeze({ width: 4, color: '#303030', opacity: 1 }),
    hover: Object.freeze({ width: 12, color: '#ffffff', opacity: 1 }),
  }),
  palette: FAMILY_DEFAULT_COLORS,
  saturation: 1,
  contrast: 1,
  brightness: 1,
  labelColor: '#292929',
  labelSize: 46,
  hubFill: '#ffffff',
  mutedOpacity: 0.38,
  fadeDuration: 180,
  focusEnabled: true,
});

const record = (value) => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const numeric = (value, fallback, min, max) => typeof value === 'number' && Number.isFinite(value)
  ? clamp(value, min, max) : fallback;
const color = (value, fallback) => typeof value === 'string' && /^#[\da-f]{6}$/i.test(value.trim())
  ? value.trim().toLowerCase() : fallback;

/** Recover a complete, independent settings object from partial or untrusted saved data. */
export function normalizeWheelSettings(value) {
  const source = record(value);
  const strokes = record(source.strokes);
  const palette = record(source.palette);
  const defaults = DEFAULT_WHEEL_SETTINGS;
  return {
    strokes: Object.fromEntries(STROKE_CONTROLS.map(({ key }) => {
      const input = record(strokes[key]);
      const fallback = defaults.strokes[key];
      return [key, {
        width: numeric(input.width, fallback.width, 0, 32),
        color: color(input.color, fallback.color),
        opacity: numeric(input.opacity, fallback.opacity, 0, 1),
      }];
    })),
    palette: Object.fromEntries(Object.entries(FAMILY_DEFAULT_COLORS).map(([name, fallback]) =>
      [name, color(palette[name], fallback)])),
    saturation: numeric(source.saturation, defaults.saturation, 0, 2),
    contrast: numeric(source.contrast, defaults.contrast, 0.5, 1.8),
    brightness: numeric(source.brightness, defaults.brightness, 0.65, 1.3),
    labelColor: color(source.labelColor, defaults.labelColor),
    labelSize: numeric(source.labelSize, defaults.labelSize, 24, 64),
    hubFill: color(source.hubFill, defaults.hubFill),
    mutedOpacity: numeric(source.mutedOpacity, defaults.mutedOpacity, 0.05, 1),
    fadeDuration: numeric(source.fadeDuration, defaults.fadeDuration, 0, 400),
    focusEnabled: typeof source.focusEnabled === 'boolean' ? source.focusEnabled : defaults.focusEnabled,
  };
}

const rgbFromHex = (hex) => [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
const hexFromRgb = (rgb) => `#${rgb.map((channel) => Math.round(clamp(channel, 0, 255))
  .toString(16).padStart(2, '0')).join('')}`;

function hslFromRgb(rgb) {
  const [red, green, blue] = rgb.map((channel) => channel / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;
  if (!delta) return [0, 0, lightness];
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  const hue = max === red ? ((green - blue) / delta) % 6
    : max === green ? (blue - red) / delta + 2 : (red - green) / delta + 4;
  return [((hue * 60) + 360) % 360, saturation, lightness];
}

function rgbFromHsl([hue, saturation, lightness]) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const sector = ((hue % 360) + 360) % 360 / 60;
  const secondary = chroma * (1 - Math.abs(sector % 2 - 1));
  const channels = sector < 1 ? [chroma, secondary, 0]
    : sector < 2 ? [secondary, chroma, 0]
      : sector < 3 ? [0, chroma, secondary]
        : sector < 4 ? [0, secondary, chroma]
          : sector < 5 ? [secondary, 0, chroma] : [chroma, 0, secondary];
  const offset = lightness - chroma / 2;
  return channels.map((channel) => (channel + offset) * 255);
}

/** Return an actual fill color, preserving the source family's relative HSL tints. */
export function colorForSector(sector, settings = DEFAULT_WHEEL_SETTINGS) {
  const sourceColor = color(sector?.color, '#808080');
  const name = sector?.primary?.name || sector?.name;
  const originalPrimary = FAMILY_DEFAULT_COLORS[name] || color(sector?.primary?.color, sourceColor);
  const override = color(settings?.palette?.[name], originalPrimary);
  let fill = sourceColor;

  if (override !== originalPrimary) {
    if (sourceColor === originalPrimary) {
      fill = override;
    } else {
      const source = hslFromRgb(rgbFromHex(sourceColor));
      const primary = hslFromRgb(rgbFromHex(originalPrimary));
      const replacement = hslFromRgb(rgbFromHex(override));
      const hueOffset = ((source[0] - primary[0] + 540) % 360) - 180;
      fill = hexFromRgb(rgbFromHsl([
        replacement[0] + hueOffset,
        clamp(replacement[1] + source[1] - primary[1], 0, 1),
        clamp(replacement[2] + source[2] - primary[2], 0, 1),
      ]));
    }
  }

  const saturation = numeric(settings?.saturation, 1, 0, 2);
  const contrast = numeric(settings?.contrast, 1, 0.5, 1.8);
  const brightness = numeric(settings?.brightness, 1, 0.65, 1.3);
  // Preserve the reference hex values exactly when no global adjustment is needed.
  if (saturation === 1 && contrast === 1 && brightness === 1) return fill;
  let rgb = rgbFromHex(fill);
  if (saturation !== 1) {
    const hsl = hslFromRgb(rgb);
    hsl[1] = clamp(hsl[1] * saturation, 0, 1);
    rgb = rgbFromHsl(hsl);
  }
  return hexFromRgb(rgb.map((channel) => ((channel - 127.5) * contrast + 127.5) * brightness));
}
