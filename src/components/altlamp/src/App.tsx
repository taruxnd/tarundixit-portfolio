import Lamp, { type LampProps } from "@/components/Lamp";

type State = {
  no: string;
  name: string;
  caption: string;
  dark?: boolean;
  lamp: LampProps;
};

const STATES: State[] = [
  { no: "01", name: "Light Mode", caption: "Illuminated · 2700K", lamp: { initialOn: true } },
  { no: "02", name: "Dark Mode", caption: "Off · silhouette", dark: true, lamp: { initialOn: false } },
  { no: "03", name: "Hover", caption: "Cord emphasized", lamp: { initialOn: true, forceHover: true } },
  { no: "04", name: "Pulled", caption: "Cord extended", lamp: { initialOn: true, pulled: true } },
  { no: "05", name: "Settled", caption: "Returned to rest", lamp: { initialOn: true } },
];

export default function App() {
  return (
    <div className="size-full overflow-auto bg-white text-neutral-900">
      <div className="mx-auto max-w-[1240px] px-8 py-16 sm:py-20">
        {/* Header */}
        <header className="mb-14 flex flex-wrap items-end justify-between gap-6 border-b border-neutral-200 pb-8">
          <div>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-400">
              Product Specification
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              Dome Pendant 01
            </h1>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-neutral-500">
            Matte black powder-coated shade, brushed brass fitting, and a walnut
            pull. Pull the cord to toggle the light.
          </p>
        </header>

        {/* State sheet */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-5">
          {STATES.map((s) => (
            <figure key={s.no} className={`flex flex-col ${s.dark ? "bg-neutral-950" : "bg-white"}`}>
              <div className="px-2 pt-4">
                <Lamp {...s.lamp} />
              </div>
              <figcaption
                className={`flex items-baseline gap-3 px-6 pb-7 pt-2 ${
                  s.dark ? "text-neutral-300" : "text-neutral-800"
                }`}
              >
                <span
                  className={`text-[11px] font-medium tabular-nums tracking-widest ${
                    s.dark ? "text-neutral-600" : "text-neutral-300"
                  }`}
                >
                  {s.no}
                </span>
                <span className="flex flex-col">
                  <span className="text-[13px] font-medium tracking-tight">{s.name}</span>
                  <span
                    className={`text-[11px] tracking-wide ${
                      s.dark ? "text-neutral-500" : "text-neutral-400"
                    }`}
                  >
                    {s.caption}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-8 text-center text-[11px] uppercase tracking-[0.28em] text-neutral-300">
          Dome Pendant 01 — Ø 180 · Powder-coated steel · Brass · Walnut
        </p>
      </div>
    </div>
  );
}
