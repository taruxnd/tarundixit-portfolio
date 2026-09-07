"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";

interface PolaroidFrameProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  children?: ReactNode;
}

export default function PolaroidFrame({
  src,
  alt,
  caption,
  className = "",
  children,
}: PolaroidFrameProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 24, rotate: 8 }}
      animate={{ opacity: 1, y: 0, rotate: 6 }}
      transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ rotate: 4, y: -4 }}
    >
      <div className="bg-white p-2.5 pb-4 shadow-[0_16px_48px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.04)] sm:p-3 sm:pb-4">
        <div className="relative aspect-[5/6] w-full overflow-hidden bg-neutral-100">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            className="object-cover object-top"
            sizes="(max-width: 640px) 260px, (max-width: 1024px) 280px, 300px"
          />
        </div>

        {caption ? (
          <p className="polaroid-caption mt-2 text-center text-[26px] leading-none text-neutral-900">
            {caption}
          </p>
        ) : null}
      </div>

      {children}
    </motion.div>
  );
}
