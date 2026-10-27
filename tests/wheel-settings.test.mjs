import test from 'node:test';
import assert from 'node:assert/strict';
import { explorerSectors, families } from '../src/explorer/explorer-data.js';
import {
  DEFAULT_WHEEL_SETTINGS, STROKE_CONTROLS, FAMILY_DEFAULT_COLORS,
  normalizeWheelSettings, colorForSector,
} from '../src/explorer/wheel-settings.js';

const channels = (hex) => [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
const lightness = (hex) => (Math.max(...channels(hex)) + Math.min(...channels(hex))) / 510;

test('default settings preserve all 108 source fills and six family swatches exactly', () => {
  const settings = normalizeWheelSettings();
  assert.deepEqual(settings, DEFAULT_WHEEL_SETTINGS);
  assert.equal(explorerSectors.length, 108);
  for (const sector of explorerSectors) assert.equal(colorForSector(sector, settings), sector.color, sector.name);
  for (const family of families) {
    assert.equal(colorForSector(family, settings), family.color, family.name);
    assert.equal(FAMILY_DEFAULT_COLORS[family.name], family.color);
  }
  assert.deepEqual(STROKE_CONTROLS.map(({ key, label }) => [key, label]), [
    ['outer', 'Outer border'], ['rings', 'Ring lines'], ['sectors', 'Sector lines'],
    ['primary', 'Main separators'], ['hub', 'Center outline'], ['hover', 'Hover outline'],
  ]);
});

test('family overrides recolor the primary exactly while retaining child tints', () => {
  const override = '#2060a0';
  const settings = normalizeWheelSettings({ palette: { Anger: override } });
  const anger = families.find(({ name }) => name === 'Anger');
  assert.equal(colorForSector(anger, settings), override);
  const primarySector = explorerSectors.find(({ name, ring }) => name === 'Anger' && ring === 0);
  assert.equal(colorForSector(primarySector, settings), override);
  const hostile = explorerSectors.find(({ name }) => name === 'Hostile');
  const recolored = colorForSector(hostile, settings);
  assert.notEqual(recolored, hostile.color);
  assert.notEqual(recolored, override);
  assert.ok(lightness(recolored) > lightness(override));
  assert.ok(Math.abs((lightness(recolored) - lightness(override))
    - (lightness(hostile.color) - lightness(anger.color))) < 2 / 255,
  'The child retains its relative lightness, allowing RGB rounding');
  assert.ok(new Set(explorerSectors.filter((sector) => sector.primary.name === 'Anger')
    .map((sector) => colorForSector(sector, settings))).size > 8, 'Family colors must not collapse to one fill');
  for (const sector of explorerSectors.filter((sector) => sector.primary.name !== 'Anger')) {
    assert.equal(colorForSector(sector, settings), sector.color, sector.name);
  }
});

test('saved numeric settings clamp to supported ranges and invalid data falls back', () => {
  const settings = normalizeWheelSettings({
    strokes: {
      outer: { width: -10, color: 'red', opacity: 4 },
      rings: { width: 99, color: '#AABBCC', opacity: -3 },
      sectors: { width: Infinity, opacity: NaN },
      hover: null,
      unknown: { width: 20 },
    },
    palette: { Anger: '#12efAB', Fear: '#fff', Unknown: '#000000' },
    saturation: 20,
    contrast: 0,
    brightness: 10,
    labelColor: '#123',
    labelSize: 4,
    hubFill: 'url(example)',
    mutedOpacity: -1,
    fadeDuration: 1000,
    focusEnabled: 'false',
    unexpected: true,
  });
  assert.deepEqual(settings.strokes.outer, { width: 0, color: '#303030', opacity: 1 });
  assert.deepEqual(settings.strokes.rings, { width: 32, color: '#aabbcc', opacity: 0 });
  assert.deepEqual(settings.strokes.sectors, DEFAULT_WHEEL_SETTINGS.strokes.sectors);
  assert.deepEqual(settings.strokes.hover, DEFAULT_WHEEL_SETTINGS.strokes.hover);
  assert.equal(settings.palette.Anger, '#12efab');
  assert.equal(settings.palette.Fear, FAMILY_DEFAULT_COLORS.Fear);
  assert.equal(settings.saturation, 2);
  assert.equal(settings.contrast, 0.5);
  assert.equal(settings.brightness, 1.3);
  assert.equal(settings.labelColor, '#292929');
  assert.equal(settings.labelSize, 24);
  assert.equal(settings.hubFill, '#ffffff');
  assert.equal(settings.mutedOpacity, 0.05);
  assert.equal(settings.fadeDuration, 400);
  assert.equal(settings.focusEnabled, true);
  assert.equal('unexpected' in settings, false);
  assert.equal('unknown' in settings.strokes, false);
  assert.equal('Unknown' in settings.palette, false);
});

test('normalization accepts valid lower bounds, disabled focus, and complete color overrides', () => {
  const settings = normalizeWheelSettings({
    saturation: 0, contrast: 1.8, brightness: 0.65,
    labelSize: 64, mutedOpacity: 1, fadeDuration: 0, focusEnabled: false,
    labelColor: '#ABCDEF', hubFill: '#000000',
  });
  assert.equal(settings.saturation, 0);
  assert.equal(settings.contrast, 1.8);
  assert.equal(settings.brightness, 0.65);
  assert.equal(settings.labelSize, 64);
  assert.equal(settings.mutedOpacity, 1);
  assert.equal(settings.fadeDuration, 0);
  assert.equal(settings.focusEnabled, false);
  assert.equal(settings.labelColor, '#abcdef');
  assert.equal(settings.hubFill, '#000000');
  for (const invalid of [null, [], true, 'settings', 12]) {
    assert.deepEqual(normalizeWheelSettings(invalid), DEFAULT_WHEEL_SETTINGS);
  }
});

test('global controls produce adjusted hex fills rather than relying on a CSS filter', () => {
  const sector = explorerSectors.find(({ name, ring }) => name === 'Anger' && ring === 0);
  const gray = channels(colorForSector(sector, normalizeWheelSettings({ saturation: 0 })));
  assert.equal(gray[0], gray[1]);
  assert.equal(gray[1], gray[2]);
  assert.ok(lightness(colorForSector(sector, normalizeWheelSettings({ brightness: 0.65 })))
    < lightness(sector.color));
  assert.ok(lightness(colorForSector(sector, normalizeWheelSettings({ brightness: 1.3 })))
    > lightness(sector.color));
  const lowerContrast = channels(colorForSector(sector, normalizeWheelSettings({ contrast: 0.5 })));
  assert.ok(Math.max(...lowerContrast) - Math.min(...lowerContrast)
    < Math.max(...channels(sector.color)) - Math.min(...channels(sector.color)));
});

test('extreme valid adjustments always yield finite six-digit hex colors', () => {
  for (const saturation of [0, 2]) {
    for (const contrast of [0.5, 1.8]) {
      for (const brightness of [0.65, 1.3]) {
        for (const override of ['#000000', '#ffffff', '#ff00ff']) {
          const settings = normalizeWheelSettings({ saturation, contrast, brightness,
            palette: Object.fromEntries(families.map(({ name }) => [name, override])) });
          for (const sector of explorerSectors) {
            const fill = colorForSector(sector, settings);
            assert.match(fill, /^#[\da-f]{6}$/);
            assert.ok(channels(fill).every(Number.isFinite));
          }
        }
      }
    }
  }
});

test('normalization and color evaluation never mutate defaults or another settings instance', () => {
  const snapshot = JSON.stringify(DEFAULT_WHEEL_SETTINGS);
  const first = normalizeWheelSettings();
  const second = normalizeWheelSettings();
  assert.notEqual(first.strokes, second.strokes);
  assert.notEqual(first.strokes.outer, second.strokes.outer);
  assert.notEqual(first.palette, second.palette);
  first.strokes.outer.width = 23;
  first.palette.Anger = '#00ff00';
  colorForSector(explorerSectors[0], first);
  assert.equal(JSON.stringify(DEFAULT_WHEEL_SETTINGS), snapshot);
  assert.deepEqual(second, DEFAULT_WHEEL_SETTINGS);
});
