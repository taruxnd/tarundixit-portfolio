export type Entry = {
  id: string;
  name: string;
  company?: string;
  message: string;
  linkedin: string;
  photo: string;
  /** ISO date the hello was planted. */
  createdAt: string;
};

/** Small FNV-1a hash so every card gets stable, id-derived variation. */
export function hashId(id: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Deterministic per-entry look: tilt, tape offset, and a wind phase. */
export function seededLook(id: string) {
  const h = hashId(id);
  const unit = (shift: number) => ((h >>> shift) & 0xff) / 255;
  return {
    tilt: (unit(0) - 0.5) * 12, // -6deg … 6deg
    tapeX: 22 + unit(8) * 40, // px from the card's left edge
    swayDuration: 2.2 + unit(16) * 0.9, // seconds, close to the flower bed's rhythm
    swayDelay: -unit(24) * 3, // negative so cards start mid-sway
    lean: (unit(4) - 0.5) * 3, // stake lean, -1.5deg … 1.5deg
  };
}

export function formatPlanted(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  // Fixed labels and UTC keep server/browser locale data and time zones from
  // changing the rendered text during hydration.
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]}`;
}
