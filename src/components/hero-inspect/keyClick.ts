/**
 * A soft mechanical key sound: a short thock on press, a lighter tick on
 * release. Synthesized, quiet, and only ever after a user gesture.
 */
let ctx: AudioContext | undefined;

export function playKeyClick(down: boolean) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume().catch(() => {});
    const now = ctx.currentTime;
    const len = Math.ceil(ctx.sampleRate * 0.03);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = down ? 1400 : 2600;
    filter.Q.value = 1.1;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(down ? 0.22 : 0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.05);
    if (down) {
      // A little body under the click, the "thock".
      const osc = ctx.createOscillator();
      const og = ctx.createGain();
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.05);
      og.gain.setValueAtTime(0.12, now);
      og.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      osc.connect(og);
      og.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    }
  } catch {
    /* no audio, no problem */
  }
}
