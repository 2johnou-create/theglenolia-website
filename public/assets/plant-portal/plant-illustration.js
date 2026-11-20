// Each five-position group uses all five drawings, with a different planting order.
const PLANTING_PATTERNS = [
  [1, 4, 2, 5, 3],
  [5, 3, 1, 2, 4],
  [2, 4, 5, 3, 1],
  [3, 1, 4, 2, 5],
  [2, 5, 3, 1, 4],
  [1, 3, 5, 4, 2],
  [4, 2, 1, 5, 3]
];

export function stageIllustrationFile(stage, variant) {
  return 'stage-' + stage + (variant === 1 ? '' : '-v' + variant) + '.webp';
}

export function plantIllustration(stage, {row, position}) {
  const index = (row - 1) * 19 + position - 1;
  const group = Math.floor(index / 5);
  const variant = PLANTING_PATTERNS[group % PLANTING_PATTERNS.length][index % 5];

  // Mix nine gentle leans with seven widths. The 63 combinations repeat only after
  // 63 groups of a given variant, beyond the atlas's 228 stable planting positions.
  const shape = (group * 19 + variant * 7) % 63;
  const lean = (shape % 9 - 4) * 1.25;
  const width = (94 + 2 * Math.floor(shape / 9)) / 100;
  const file = stageIllustrationFile(stage, variant);
  return {variant, file, transform: 'skewX(' + lean + 'deg) scaleX(' + width + ')'};
}

export function setPlantIllustration(image, assetDirectory, stage, plant) {
  const art = plantIllustration(stage, plant);
  image.setAttribute(image.localName === 'image' ? 'href' : 'src', assetDirectory + '/' + art.file);
  image.dataset.variant = String(art.variant);
  // The common artwork root is (128, 259) in the 256 × 288 plate. Only the drawing
  // changes shape. Position, printed identifier and interactive target stay fixed.
  image.style.transformBox = 'fill-box';
  image.style.transformOrigin = '50% 89.93%';
  image.style.transform = art.transform;
}
