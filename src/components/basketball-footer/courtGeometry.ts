// Both canvases use this projection, so the hoop stays mounted on the trunk.
export function getTreeLayout(width: number, height: number) {
  const referenceHeight = width < 768 ? 450 : Math.min(540, Math.max(420, width * .38));
  const scale = Math.min(Math.min(height, referenceHeight) * .94 / 130, width * (width < 768 ? .85 : .38) / 70);
  return { scale, x: width * .79, y: 0 };
}
export function getHoopLayout(width: number, height: number) {
  const compositionWidth = Math.min(width,1440);
  const offset = (width-compositionWidth)/2;
  const tree = getTreeLayout(compositionWidth, height);
  const boardWidth = Math.min(110, Math.max(width < 768 ? 68 : 94, 22 * tree.scale));
  const boardHeight = boardWidth * .64;
  const x = offset + compositionWidth * .79;
  const top = height - (78 * tree.scale + tree.y);
  const rimY = top + boardHeight + 8;
  return { backboardX: x, backboardTop: top, backboardBottom: top + boardHeight,
    backboardWidth: boardWidth, backboardHeight: boardHeight, rimY,
    rimFrontX: x - boardWidth * .43, rimBackX: x + boardWidth * .43,
    pegRadius: 3, boundsLeft: x - boardWidth / 2, boundsTop: top, boundsBottom: rimY + 82 };
}
export function drawHoop(ctx: CanvasRenderingContext2D, hoop: ReturnType<typeof getHoopLayout>, rim: string, net: string, sinceScore: number) {
  const {backboardX: x, backboardTop: top, backboardWidth: w, backboardHeight: h, rimY: y} = hoop;
  ctx.save();
  ctx.fillStyle = 'rgba(237,230,214,.92)'; ctx.strokeStyle = '#484036'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x-w/2, top, w, h, 4); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#a74121'; ctx.lineWidth = 2; ctx.strokeRect(x-w*.18, top+h*.32, w*.36, h*.48);
  ctx.restore();
  drawHoopForeground(ctx,hoop,rim,net,sinceScore);
}

// Render the front net over the ball so a basket reads as passing through it.
export function drawHoopForeground(ctx: CanvasRenderingContext2D, hoop: ReturnType<typeof getHoopLayout>, rim: string, net: string, sinceScore: number) {
  const x=hoop.backboardX,y=hoop.rimY,half=hoop.backboardWidth*.43;
  const elapsed=Math.max(0,sinceScore);
  const pulse=elapsed<900?Math.sin(elapsed/900*Math.PI)*Math.exp(-elapsed/500):0;
  const length=72+22*pulse,sway=Math.sin(elapsed/80)*4*pulse;
  ctx.save();ctx.strokeStyle=net;ctx.lineWidth=1.2;ctx.globalAlpha=.72;
  for(let i=0;i<=8;i++) {
    const u=i/8;
    ctx.beginPath();ctx.moveTo(x-half+2*half*u,y+2);ctx.lineTo(x-half*.55+half*1.1*u+sway,y+length);ctx.stroke();
  }
  for(let i=1;i<=5;i++) {
    const u=i/6,span=half*(1-.45*u);
    ctx.beginPath();ctx.moveTo(x-span+sway*u,y+length*u);ctx.lineTo(x+span+sway*u,y+length*u);ctx.stroke();
  }
  ctx.globalAlpha=1;ctx.strokeStyle=rim;ctx.lineWidth=4;
  ctx.beginPath();ctx.ellipse(x,y,half,5,0,0,Math.PI);ctx.stroke();ctx.restore();
}

export function drawScoreDisplay(ctx: CanvasRenderingContext2D, hoop: ReturnType<typeof getHoopLayout>, score: number) {
  const x=hoop.backboardX, y=hoop.rimY+105;
  ctx.save();
  ctx.fillStyle='#25231f';ctx.strokeStyle='#85735a';ctx.lineWidth=2;
  ctx.beginPath();ctx.roundRect(x-29,y-18,58,43,5);ctx.fill();ctx.stroke();
  ctx.fillStyle='#aca694';ctx.font='7px sans-serif';ctx.textAlign='center';ctx.fillText('SCORE',x,y-6);
  ctx.fillStyle='#e9d9a3';ctx.font='600 19px monospace';ctx.fillText(String(score).padStart(2,'0'),x,y+16);
  ctx.restore();
}
