"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { AboutCarouselImage } from "../about-carousel";
import type { HomeMosaicItem } from "./home-mosaic.items";

type HomeMosaicCardProps = {
  image: AboutCarouselImage;
  item: HomeMosaicItem;
};

function getMobileLeft(start: number) {
  const columnOffset = start - 1;

  return `calc(${columnOffset * 12.5}vw + ${16 - columnOffset * 2.125}px)`;
}

function getMobileWidth(columns: number) {
  return `calc(${columns * 12.5}vw - ${columns * 2.125 + 15}px)`;
}

export function HomeMosaicCard({ image, item }: HomeMosaicCardProps) {
  const shouldReduceMotion = useReducedMotion();

  function renderCard(variant: "desktop" | "mobile") {
    const isMobile = variant === "mobile";
    const position = isMobile ? item.mobile : item.desktop;

    return (
      <motion.figure
        animate={{ opacity: 1, scale: 1 }}
        className={`home-mosaic-card absolute z-[5] m-0 overflow-hidden bg-[#efefed] will-change-transform ${
          isMobile ? "min-[641px]:hidden" : "hidden min-[641px]:block"
        }`}
        data-cursor-label={item.title}
        data-hover-image=""
        data-hover-shader=""
        data-hover-src={image.src}
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.985 }}
        style={
          isMobile
            ? {
                aspectRatio: `1 / ${position.aspectHeightRatio}`,
                left: getMobileLeft(position.start),
                top: `${position.top}vh`,
                width: getMobileWidth(position.columns),
              }
            : {
                aspectRatio: `1 / ${position.aspectHeightRatio}`,
                gridColumn: `${position.start} / span ${position.columns}`,
                top: `${position.top}vh`,
                width: "100%",
              }
        }
        transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      >
        <Image
          alt=""
          className="object-cover"
          data-hover-media=""
          draggable={false}
          fill
          sizes="(max-width: 640px) 75vw, (max-width: 1279px) 38vw, 35vw"
          src={image.src}
        />

        <figcaption className="sr-only">{item.title}</figcaption>
      </motion.figure>
    );
  }

  return (
    <>
      {renderCard("mobile")}
      {renderCard("desktop")}
    </>
  );
}

