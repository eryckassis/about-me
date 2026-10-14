"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import {
  aboutCarouselImages,
  type AboutCarouselImage,
} from "./about-carousel.images";

type FoldCardProps = {
  image: AboutCarouselImage;
};

type CardImageProps = {
  align: "top" | "bottom";
  image: AboutCarouselImage;
};

const imageSizes =
  "(max-width: 360px) calc(100vw - 40px), (max-width: 1279px) 320px, 329px";

function CardImage({ align, image }: CardImageProps) {
  return (
    <div
      className={`absolute inset-x-0 h-[200%] ${
        align === "top" ? "top-0" : "bottom-0"
      }`}
    >
      <Image
        alt=""
        className="h-full w-full object-cover"
        draggable={false}
        height={image.height}
        sizes={imageSizes}
        src={image.src}
        width={image.width}
      />
    </div>
  );
}

function FoldCard({ image }: FoldCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const topRotateX = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [18, 0, 0, -14],
  );
  const topY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [12, 0, 0, -8],
  );

  const bottomRotateX = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [-18, 0, 0, 14],
  );
  const bottomY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [-12, 0, 0, 8],
  );

  return (
    <motion.figure
      ref={cardRef}
      aria-label={image.alt || undefined}
      className={`relative w-full ${
        image.featured ? "aspect-[320/430]" : "aspect-[320/383]"
      }`}
      role={image.alt ? "img" : undefined}
      style={{
        perspective: 900,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-[calc(50%+1px)] origin-bottom overflow-hidden [backface-visibility:hidden] will-change-transform"
        style={{
          rotateX: shouldReduceMotion ? 0 : topRotateX,
          transformStyle: "preserve-3d",
          y: shouldReduceMotion ? 0 : topY,
        }}
      >
        <CardImage align="top" image={image} />
      </motion.div>

      <motion.div
        className="absolute inset-x-0 top-1/2 h-1/2 origin-top overflow-hidden [backface-visibility:hidden] will-change-transform"
        style={{
          rotateX: shouldReduceMotion ? 0 : bottomRotateX,
          transformStyle: "preserve-3d",
          y: shouldReduceMotion ? 0 : bottomY,
        }}
      >
        <CardImage align="bottom" image={image} />
      </motion.div>
    </motion.figure>
  );
}

export function AboutCarousel() {
  return (
    <section
      id="about-gallery"
      aria-labelledby="about-gallery-title"
      className="relative z-[8] mx-auto mt-[31px] w-full max-w-[var(--layout-mobile-content)] xl:col-span-2 xl:col-start-4 xl:row-start-1 xl:mx-0 xl:mt-[56vh] xl:max-w-none"
    >
      <h2 id="about-gallery-title" className="sr-only">
        Estudio Bang gallery
      </h2>

      <div className="flex flex-col gap-[31px]">
        {aboutCarouselImages.map((image) => (
          <FoldCard key={image.src} image={image} />
        ))}
      </div>
    </section>
  );
}
