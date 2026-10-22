import type { ReactNode } from "react";
import { assetUrl } from "@/lib/cdnAssets";
import "./client-strip.css";

/** Brands on Kumba, the products I design. Logos live in public/work/brand-hub/logos. */
const BRANDS = [
  ["godrej", "Godrej"],
  ["dabur", "Dabur"],
  ["bajaj-consumer-care", "Bajaj Consumer Care"],
  ["lulu", "Lulu Retail"],
  ["murugappa", "Murugappa"],
  ["digiyatra", "DigiYatra"],
  ["tradeling", "Tradeling"],
  ["soch", "Soch"],
  ["meru", "Meru"],
  ["images-group", "Images Group"],
  ["house-of-biryan", "House of Biryan"],
  ["paci", "Paci"],
] as const;

export default function ClientStrip({
  label,
  logos = assetUrl("work/brand-hub/logos"),
  className = "",
}: {
  label?: ReactNode;
  logos?: string;
  className?: string;
}) {
  return (
    <div className={`client-strip ${className}`.trim()} aria-label="Brands using Kumba">
      {label ? <p className="client-strip__label">{label}</p> : null}
      <div className="client-strip__rail">
        <ul className="client-strip__track">
          {[...BRANDS, ...BRANDS].map(([file, name], i) => (
            <li
              key={`${file}-${i}`}
              className="client-strip__logo"
              aria-hidden={i >= BRANDS.length || undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${logos}/${file}.webp`} alt={name} width={124} height={48} loading="eager" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
