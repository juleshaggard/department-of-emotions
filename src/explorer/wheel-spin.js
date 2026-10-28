export const canonicalAngle = (angle) => ((angle + 180) % 360 + 360) % 360 - 180;

export function spinLanding(currentRotation, requestedAngle) {
  if (!Number.isFinite(currentRotation) || !Number.isFinite(requestedAngle)) {
    throw new TypeError('Spin angles must be finite numbers');
  }
  const startAngle = canonicalAngle(currentRotation);
  const targetAngle = canonicalAngle(requestedAngle);
  const remainder = ((targetAngle - startAngle) % 360 + 360) % 360;
  return { startAngle, targetAngle, endAngle: startAngle + 720 + remainder };
}

export function pickRandomEmotion(sectors, random = Math.random) {
  const choices = [];
  const names = new Set();
  for (const sector of sectors) {
    if (!names.has(sector.name)) {
      names.add(sector.name);
      choices.push(sector);
    }
  }
  if (!choices.length) throw new RangeError('The wheel needs at least one emotion');
  const sample = random();
  if (!Number.isFinite(sample)) throw new TypeError('The random sample must be finite');
  const index = Math.max(0, Math.min(choices.length - 1, Math.floor(sample * choices.length)));
  return choices[index];
}
