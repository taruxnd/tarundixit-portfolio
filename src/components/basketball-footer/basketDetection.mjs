// Score at the middle of the visible net, after the ball has cleared the rim.
// Sweep between physics steps so fast throws cannot skip the scoring line.
export function crossesHoopDownward(previous, current, hoop) {
  const netDepth = 36;
  const scoringY = hoop.rimY + netDepth;
  if (!Number.isFinite(previous.y) || current.y <= previous.y || previous.y >= scoringY || current.y < scoringY) return false;
  const progress = (scoringY - previous.y) / (current.y - previous.y);
  const x = previous.x + (current.x - previous.x) * progress;
  const center = (hoop.rimFrontX + hoop.rimBackX) / 2;
  // Match the taper drawn by drawHoopForeground at half the net's height.
  const halfWidth = Math.abs(hoop.rimBackX - hoop.rimFrontX) / 2 * .775;
  return Math.abs(x - center) <= halfWidth;
}
