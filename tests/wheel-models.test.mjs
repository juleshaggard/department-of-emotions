import test from 'node:test';
import assert from 'node:assert/strict';
import { wheelModels } from '../src/wheels/wheel-models.js';
import { explorerSectors, families, isInFocusedBranch } from '../src/explorer/explorer-data.js';

const epsilon = 1e-7;
test('the draft keeps the original wheel data unchanged', () => {
  const original=wheelModels[0];
  assert.equal(original.id,'feelings');
  assert.equal(original.sectors,explorerSectors);
  assert.equal(original.families,families);
  assert.equal(original.sectors.length,108);
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
