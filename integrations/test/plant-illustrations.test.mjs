import assert from 'node:assert/strict';
import test from 'node:test';
import {plantIllustration} from '../../public/assets/plant-portal/plant-illustration.js';

test('pilot plants mix all five drawings while each of the 228 stable positions keeps an individual appearance', () => {
  const pilotCounts = [0, 0, 0, 0, 0];
  const appearances = new Set();
  for (let index = 0; index < 228; index++) {
    const position = {row: Math.floor(index / 19) + 1, position: index % 19 + 1};
    const seedling = plantIllustration(2, position);
    if (index < 27) pilotCounts[seedling.variant - 1]++;
    const signature = seedling.file + ' ' + seedling.transform;
    assert.ok(!appearances.has(signature), 'Duplicate illustration at P' + (index + 1));
    appearances.add(signature);
    for (let stage = 1; stage <= 10; stage++) {
      const art = plantIllustration(stage, {...position, stage});
      assert.equal(art.variant, seedling.variant);
      assert.equal(art.transform, seedling.transform);
      const suffix = art.variant === 1 ? '' : '-v' + art.variant;
      assert.equal(art.file, 'stage-' + stage + suffix + '.webp');
    }
  }
  assert.deepEqual(pilotCounts.toSorted(), [5, 5, 5, 6, 6]);
});
