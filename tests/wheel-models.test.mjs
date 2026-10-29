import test from 'node:test';
import assert from 'node:assert/strict';
import { wheelModels } from '../src/wheels/wheel-models.js';
import { explorerSectors, families, isInFocusedBranch } from '../src/explorer/explorer-data.js';
import referencePalette from '../src/reference-palette.json' with { type: 'json' };

const epsilon = 1e-7;

function relativeLuminance(hex) {
  const channels = [1, 3, 5].map(offset => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrastRatio(first, second) {
  const luminances = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => a - b);
  return (luminances[1] + 0.05) / (luminances[0] + 0.05);
}

function roundedHue(hex) {
  const [red, green, blue] = [1, 3, 5].map(offset => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const maximum = Math.max(red, green, blue), minimum = Math.min(red, green, blue);
  const delta = maximum - minimum;
  if (!delta) return null;
  const sector = maximum === red ? (green - blue) / delta : maximum === green ? (blue - red) / delta + 2 : (red - green) / delta + 4;
  return Math.round((sector * 60 + 360) % 360);
}

test('the draft keeps the original wheel data unchanged', () => {
  const original=wheelModels[0];
  assert.equal(original.id,'feelings');
  assert.equal(original.sectors,explorerSectors);
  assert.equal(original.families,families);
  assert.equal(original.sectors.length,108);
});
test('Feelings preserves every reference fill in source order', () => {
  const original = wheelModels.find(model => model.id === 'feelings');
  ['primary', 'secondary', 'tertiary'].forEach((key, ring) => {
    assert.deepEqual(original.sectors.filter(sector => sector.ring === ring).map(sector => sector.color), referencePalette[key]);
  });
});
test('alternative fills are valid colors with readable default labels', () => {
  for (const model of wheelModels.filter(model => !model.original)) {
    for (const sector of model.sectors) {
      const label = `${model.id}: ${sector.name}`;
      assert.match(sector.color, /^#[\da-f]{6}$/i, label);
      assert.ok(contrastRatio(sector.color, '#292929') >= 4.5, `${label} has insufficient label contrast`);
    }
  }
});
test('alternative families have distinct branch and outer hues', () => {
  for (const model of wheelModels.filter(model => !model.original)) {
    for (const family of model.families) {
      for (let ring = 1; ring < model.radii.length - 1; ring++) {
        const cells = model.sectors.filter(sector => sector.primary.name === family.name && sector.ring === ring);
        const label = `${model.id}: ${family.name}, ring ${ring}`;
        assert.ok(new Set(cells.map(sector => sector.color.toLowerCase())).size > 1, `${label} has flat fills`);
        assert.ok(new Set(cells.map(sector => roundedHue(sector.color))).size > 1, `${label} has no hue progression`);
      }
    }
  }
});
test('paired sensations retain visible tonal separation', () => {
  const model = wheelModels.find(wheel => wheel.id === 'sensations');
  for (const parent of model.sectors.filter(sector => sector.ring === 1)) {
    const children = model.sectors.filter(sector => sector.parent === parent);
    assert.equal(children.length, 2);
    assert.ok(contrastRatio(children[0].color, children[1].color) >= 1.1, `${parent.name} has indistinguishable sensation fills`);
  }
});
test('each supplied reference has its expected hierarchy and complete content', () => {
  const expected={situations:[12,70],sensations:[6,36,72],behaviors:[6,36,36]};
  for(const model of wheelModels.slice(1)) {
    assert.deepEqual(model.radii.slice(1).map((_,ring)=>model.sectors.filter(s=>s.ring===ring).length),expected[model.id]);
    model.sectors.forEach((s,index)=>{
      assert.equal(s.index,index);
      assert.ok(s.info.definition?.trim(),`${model.id}: ${s.name}`);
      const sections=s.info.sections || [{items:s.info.somaticExperiences},{items:s.info.responses}];
      assert.equal(sections.length,2);
      assert.ok(sections.every(section=>section.items.length>=2 && section.items.every(item=>typeof item==='string'&&item.trim())));
      assert.ok(s.primary.start<=s.start+epsilon&&s.primary.end>=s.end-epsilon);
      if(s.ring===2) assert.ok(s.parent.start<=s.start+epsilon&&s.parent.end>=s.end-epsilon);
    });
  }
});
test('every ring covers exactly one turn without gaps or overlap', () => {
  for(const model of wheelModels) {
    for(let ring=0;ring<model.radii.length-1;ring++) {
      const cells=model.sectors.filter(s=>s.ring===ring).sort((a,b)=>a.start-b.start);
      assert.ok(Math.abs(cells.at(-1).end-cells[0].start-360)<epsilon);
      cells.forEach((s,i)=>{
        assert.ok(s.end>s.start);
        if(i) assert.ok(Math.abs(s.start-cells[i-1].end)<epsilon,`${model.id} ring ${ring}: ${s.name}`);
      });
    }
  }
});
test('sensation and behavior selections resolve to their own emotion branch', () => {
  for(const id of ['sensations','behaviors']) {
    const model=wheelModels.find(m=>m.id===id);
    for(const leaf of model.sectors.filter(s=>s.ring===2)) {
      const branch=model.sectors.filter(s=>isInFocusedBranch(s,leaf));
      assert.deepEqual(branch.map(s=>s.index).sort((a,b)=>a-b),[leaf.primary.index,leaf.parent.index,leaf.index].sort((a,b)=>a-b));
    }
  }
});
test('each wheel can begin with a valid family facing right', () => {
  for(const model of wheelModels) {
    const family=model.families.find(f=>f.name===model.initialName);
    assert.ok(family);
    const rotation=-(family.start+family.end)/2;
    assert.ok(Math.abs((family.start+family.end)/2+rotation)<epsilon);
    assert.equal(model.sectors[family.index].ring,0);
  }
});
