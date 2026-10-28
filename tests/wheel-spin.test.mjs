import test from 'node:test';
import assert from 'node:assert/strict';
import { explorerSectors } from '../src/explorer/explorer-data.js';
import { canonicalAngle, pickRandomEmotion, spinLanding } from '../src/explorer/wheel-spin.js';

const closeTo = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-7, `${actual} should equal ${expected}`);

test('random selection gives each unique emotion one equal interval', () => {
  const unique = explorerSectors.filter((sector, index, all) => all.findIndex(({ name }) => name === sector.name) === index);
  assert.equal(unique.length, 105);
  const selected = unique.map((_, index) => pickRandomEmotion(explorerSectors, () => (index + 0.5) / unique.length));
  assert.deepEqual(selected, unique);
  assert.equal(new Set(selected.map(({ name }) => name)).size, 105);
  for (const sector of selected) {
    assert.equal(sector, explorerSectors.find(({ name }) => name === sector.name));
  }
});

test('random selection handles the first and last samples without leaving the wheel', () => {
  const first = explorerSectors[0];
  const last = explorerSectors.at(-1);
  assert.equal(pickRandomEmotion(explorerSectors, () => 0), first);
  assert.equal(pickRandomEmotion(explorerSectors, () => 1 - Number.EPSILON), last);
  assert.equal(pickRandomEmotion(explorerSectors, () => 1), last);
  assert.equal(pickRandomEmotion(explorerSectors, () => -1), first);
  assert.throws(() => pickRandomEmotion([], () => 0), RangeError);
  assert.throws(() => pickRandomEmotion(explorerSectors, () => Number.NaN), TypeError);
});

test('every sector lands facing right after at least two clockwise turns', () => {
  for (const sector of explorerSectors) {
    const spoke = (sector.start + sector.end) / 2;
    for (const current of [-108012.5, -1080, -359.9, -180, -0.1, 0, 180, 359.9, 1080, 108012.5]) {
      const result = spinLanding(current, -spoke);
      assert.ok(result.startAngle >= -180 && result.startAngle < 180);
      assert.ok(result.targetAngle >= -180 && result.targetAngle < 180);
      const travel = result.endAngle - result.startAngle;
      assert.ok(travel >= 720 - 1e-7 && travel < 1080 + 1e-7, `${sector.name}: ${travel}`);
      closeTo(canonicalAngle(result.endAngle + spoke), 0);
      closeTo(canonicalAngle(result.endAngle), result.targetAngle);
    }
  }
});

test('same-angle spins still make two full turns and invalid angles are rejected', () => {
  const result = spinLanding(450, 90);
  assert.equal(result.startAngle, 90);
  assert.equal(result.targetAngle, 90);
  assert.equal(result.endAngle, 810);
  assert.throws(() => spinLanding(Infinity, 0), TypeError);
  assert.throws(() => spinLanding(0, Number.NaN), TypeError);
});
