import test from 'node:test';
import assert from 'node:assert/strict';
import { emotionInfo, explorerSectors, families, isInFocusedBranch } from '../src/explorer/explorer-data.js';

test('every wheel sector has a definition, body-language examples, and correct family', () => {
  assert.equal(explorerSectors.length, 108);
  assert.equal(Object.keys(emotionInfo).length, 105);
  assert.deepEqual(families.map(({ name }) => name), ['Anger', 'Sadness', 'Surprise', 'Joy', 'Love', 'Fear']);
  for (const sector of explorerSectors) {
    assert.ok(sector.info?.definition?.trim(), `Missing definition: ${sector.name}`);
    assert.ok(sector.info.bodyLanguage.length >= 2, `Missing examples: ${sector.name}`);
    assert.ok(sector.info.bodyLanguage.every((cue) => cue.trim().length > 15), sector.name);
    for (const key of ['somaticExperiences', 'behavioralExperiences']) {
      assert.ok(sector.info[key]?.length >= 2, `Missing ${key}: ${sector.name}`);
      assert.ok(sector.info[key].every((item) => item.trim().length > 15), `${key}: ${sector.name}`);
    }
    assert.ok(sector.start >= sector.primary.start - 1e-8, sector.name);
    assert.ok(sector.end <= sector.primary.end + 1e-8, sector.name);
    if (sector.ring === 2) {
      assert.ok(sector.parent, sector.name);
      assert.ok(sector.start >= sector.parent.start - 1e-8, sector.name);
      assert.ok(sector.end <= sector.parent.end + 1e-8, sector.name);
    }
  }
});

test('repeated source labels share one consistent definition without losing sectors', () => {
  for (const name of ['Sadness', 'Dismayed', 'Satisfied']) {
    const repeats = explorerSectors.filter((sector) => sector.name === name);
    assert.equal(repeats.length, 2, name);
    assert.equal(repeats[0].info, repeats[1].info, name);
  }
});

const findSector = (name, ring, family) => {
  const sector = explorerSectors.find((candidate) => candidate.name === name
    && candidate.ring === ring && candidate.primary.name === family);
  assert.ok(sector, `Missing sector: ${family}/${name} in ring ${ring}`);
  return sector;
};

const focusedBranch = (focused) => explorerSectors
  .filter((sector) => isInFocusedBranch(sector, focused));
const branchLabels = (focused) => focusedBranch(focused).map(({ name, ring }) => [name, ring]);

test('a specific feeling keeps only itself and its two ancestors bright', () => {
  const frightened = findSector('Frightened', 2, 'Fear');
  assert.deepEqual(branchLabels(frightened), [
    ['Fear', 0], ['Scared', 1], ['Frightened', 2],
  ]);
  assert.equal(isInFocusedBranch(findSector('Helpless', 2, 'Fear'), frightened), false,
    'A sibling feeling must fade');
  assert.equal(isInFocusedBranch(findSector('Terror', 1, 'Fear'), frightened), false,
    'An unrelated secondary emotion in the same family must fade');
});

test('a secondary emotion keeps its primary and both children bright', () => {
  const rage = findSector('Rage', 1, 'Anger');
  assert.deepEqual(branchLabels(rage), [
    ['Anger', 0], ['Rage', 1], ['Hate', 2], ['Hostile', 2],
  ]);
  assert.equal(isInFocusedBranch(findSector('Exasperated', 1, 'Anger'), rage), false);
  assert.equal(isInFocusedBranch(findSector('Agitated', 2, 'Anger'), rage), false,
    'A child touching the next secondary boundary must not join the branch');
});

test('a primary emotion keeps its complete family and no other family bright', () => {
  const joy = findSector('Joy', 0, 'Joy');
  const bright = focusedBranch(joy);
  assert.equal(bright.length, 25);
  assert.deepEqual(bright.filter(({ ring }) => ring === 1).map(({ name }) => name), [
    'Content', 'Happy', 'Cheerful', 'Proud', 'Optimistic', 'Enthusiastic', 'Elation', 'Enthralled',
  ]);
  assert.equal(bright.filter(({ ring }) => ring === 2).length, 16);
  assert.ok(bright.every((sector) => sector.primary.name === 'Joy'));
  assert.ok(explorerSectors.filter((sector) => sector.primary.name !== 'Joy')
    .every((sector) => !isInFocusedBranch(sector, joy)), 'All other families must fade');
});

test('repeated Dismayed labels highlight their own angular branch only', () => {
  const sadnessDismayed = findSector('Dismayed', 2, 'Sadness');
  const surpriseDismayed = findSector('Dismayed', 2, 'Surprise');
  assert.deepEqual(branchLabels(sadnessDismayed), [
    ['Sadness', 0], ['Disappointed', 1], ['Dismayed', 2],
  ]);
  assert.deepEqual(branchLabels(surpriseDismayed), [
    ['Surprise', 0], ['Stunned', 1], ['Dismayed', 2],
  ]);
  assert.equal(isInFocusedBranch(sadnessDismayed, surpriseDismayed), false);
  assert.equal(isInFocusedBranch(surpriseDismayed, sadnessDismayed), false);
});

test('branch containment tolerates rounding drift up to 1e-7, not larger gaps', () => {
  const rage = findSector('Rage', 1, 'Anger');
  const hate = findSector('Hate', 2, 'Anger');
  const hostile = findSector('Hostile', 2, 'Anger');
  const roundedRage = { ...rage, start: rage.start + 5e-8, end: rage.end - 5e-8 };
  assert.equal(isInFocusedBranch(hate, roundedRage), true);
  assert.equal(isInFocusedBranch(hostile, roundedRage), true);
  assert.equal(isInFocusedBranch(roundedRage, hate), true, 'Ancestor lookup uses the same tolerance');
  const outsideTolerance = { ...rage, start: rage.start + 2e-7, end: rage.end - 2e-7 };
  assert.equal(isInFocusedBranch(hate, outsideTolerance), false);
  assert.equal(isInFocusedBranch(hostile, outsideTolerance), false);
});
