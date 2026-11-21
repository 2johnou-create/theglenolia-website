import test from 'node:test';
import assert from 'node:assert/strict';
import {GROWTH_STAGES} from '../../public/assets/plant-portal/growth-guide.js';
import {STAGE_NAMES} from '../../public/assets/plant-portal/stages.js';
import {stageIllustrationFile} from '../../public/assets/plant-portal/plant-illustration.js';

test('public growth guide covers all existing stage identifiers with educational copy and set A',()=>{
  assert.equal(GROWTH_STAGES.length,STAGE_NAMES.length);
  for(const [index,stage] of GROWTH_STAGES.entries()) {
    assert.ok(stage.timing && stage.description && stage.observe);
    assert.match(stageIllustrationFile(index+1,1),/\.webp$/);
  }
  assert.match(GROWTH_STAGES[9].timing,/7–11 months after flowering/);
});
