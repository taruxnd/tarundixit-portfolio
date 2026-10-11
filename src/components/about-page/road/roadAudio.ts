/**
 * Road sounds. Horns are synthesized (two-tone Indian air horn for the
 * WagonRs, a deeper one for the Carry) so nothing downloads before a tap. To use real recordings instead, drop files in `public/audio/` and
 * list them in HORN_SAMPLES below — a listed sample replaces the synth for
 * that voice, and anything missing falls back to the synth.
 */

export type HornVoice = "hatch" | "van" | "mpv";

const HORN_SAMPLES: Partial<Record<HornVoice, string>> = {
  // hatch: "/audio/horn-wagonr.mp3",
  // van: "/audio/horn-carry.mp3",
};

let context: AudioContext | undefined;
let master: GainNode | undefined;
let shaper: WaveShaperNode | undefined;
const samples = new Map<HornVoice, AudioBuffer | null>();
const lastPlayed: Record<string, number> = {};

/** Call from a user gesture (pointerdown/click) before playing. */
export function unlockRoadAudio() {
  if (typeof window === "undefined") return;
  try {
    context ??= new AudioContext();
    if (context.state === "suspended") void context.resume().catch(() => {});
    if (!master) {
      master = context.createGain();
      master.gain.value = 0.9;
      master.connect(context.destination);
    }
  } catch {
    /* no audio */
  }
}

function softClip(): WaveShaperNode {
  if (shaper) return shaper;
  shaper = context!.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = (i / 255) * 2 - 1;
    curve[i] = Math.tanh(x * 2.2);
  }
  shaper.curve = curve;
  shaper.connect(master!);
  return shaper;
}

async function loadSample(voice: HornVoice): Promise<AudioBuffer | null> {
  const url = HORN_SAMPLES[voice];
  if (!url || !context) return null;
  if (samples.has(voice)) return samples.get(voice) ?? null;
  samples.set(voice, null);
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await context.decodeAudioData(await res.arrayBuffer());
    samples.set(voice, buffer);
    return buffer;
  } catch {
    return null;
  }
}

/** One horn blast: two detuned saws through a lowpass, slight pitch sag. */
function blast(
  at: number,
  freqs: number[],
  duration: number,
  volume: number,
  type: OscillatorType = "sawtooth",
) {
  const ctx = context!;
  const out = softClip();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1800, at);
  filter.frequency.exponentialRampToValueAtTime(1100, at + duration);
  filter.Q.value = 1.2;
  gain.connect(filter);
  filter.connect(out);

  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(volume, at + 0.018);
  gain.gain.setValueAtTime(volume, at + duration - 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);

  for (const f of freqs) {
    for (const detune of [-6, 7]) {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.detune.value = detune;
      osc.frequency.setValueAtTime(f * 1.04, at);
      osc.frequency.exponentialRampToValueAtTime(f, at + 0.06);
      osc.frequency.linearRampToValueAtTime(f * 0.985, at + duration);
      osc.connect(gain);
      osc.start(at);
      osc.stop(at + duration + 0.02);
    }
  }
}

const VOICES: Record<HornVoice, (at: number, v: number) => void> = {
  // Maruti two-tone: "pom-pom".
  hatch(at, v) {
    blast(at, [440, 554], 0.17, v);
    blast(at + 0.24, [440, 554], 0.21, v);
  },
  // Carry: lower, longer, a bit rude.
  van(at, v) {
    blast(at, [311, 392], 0.42, v * 0.95);
  },
  // Carens: modern dual-tone, one firm press.
  mpv(at, v) {
    blast(at, [370, 466], 0.3, v);
  },
};

export function playHorn(voice: HornVoice, volume = 0.16, delayMs = 0) {
  if (!context || !master || context.state !== "running") return;
  const key = `horn-${voice}`;
  const now = context.currentTime;
  if (delayMs === 0 && now - (lastPlayed[key] ?? -1) < 0.2) return;
  lastPlayed[key] = now;
  const at = now + delayMs / 1000;

  try {
    const sampleUrl = HORN_SAMPLES[voice];
    if (sampleUrl) {
      void loadSample(voice).then((buffer) => {
        if (!buffer || !context || !master) return VOICES[voice](at, volume);
        const source = context.createBufferSource();
        const gain = context.createGain();
        gain.gain.value = volume * 3;
        source.buffer = buffer;
        source.connect(gain);
        gain.connect(master);
        source.start(Math.max(at, context.currentTime));
      });
      return;
    }
    VOICES[voice](at, volume);
  } catch {
    /* ignore */
  }
}


/** The constable's whistle: two short, shrill trills. */
export function playWhistle(volume = 0.08) {
  if (!context || !master || context.state !== "running") return;
  const key = "whistle";
  const now = context.currentTime;
  if (now - (lastPlayed[key] ?? -1) < 0.4) return;
  lastPlayed[key] = now;
  try {
    const ctx = context;
    const trill = (at: number, duration: number) => {
      const osc = ctx.createOscillator();
      const warble = ctx.createOscillator();
      const warbleGain = ctx.createGain();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(2650, at);
      warble.type = "sine";
      warble.frequency.value = 28;
      warbleGain.gain.value = 180;
      warble.connect(warbleGain);
      warbleGain.connect(osc.frequency);
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 2700;
      filter.Q.value = 6;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(volume, at + 0.015);
      gain.gain.setValueAtTime(volume, at + duration - 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master!);
      osc.start(at);
      warble.start(at);
      osc.stop(at + duration + 0.02);
      warble.stop(at + duration + 0.02);
    };
    trill(now, 0.16);
    trill(now + 0.22, 0.26);
  } catch {
    /* ignore */
  }
}
