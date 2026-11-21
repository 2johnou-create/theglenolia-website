// The directory and camera page the same positions after a resize or view change.
export function positionsPerView(width, wholeField) {
  if (width < 670) return 6;
  return wholeField ? 19 : 10;
}
