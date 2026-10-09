import Image from "next/image";

type BentoTileProps = {
  cartoonSrc: string;
  alt: string;
  label: string;
  index: number;
  sizes: string;
};

export default function AboutBentoTile({ cartoonSrc, alt, label, index, sizes }: BentoTileProps) {
  return (
    <figure className={`about-bento__tile about-bento__tile--${index + 1}`}>
      <Image
        src={cartoonSrc}
        alt={alt}
        fill
        className="about-bento__image"
        sizes={sizes}
        priority={index < 2}
      />
      <div className="about-bento__scrim" aria-hidden />
      <span className="about-bento__label">{label}</span>
    </figure>
  );
}
