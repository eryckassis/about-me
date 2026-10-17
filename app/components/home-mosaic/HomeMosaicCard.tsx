"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { AboutCarouselImage } from "../about-carousel";
import { FoldImage } from "../fold-image";
import type { HomeMosaicItem } from "./home-mosaic.items";

type HomeMosaicCardProps = {
  image: AboutCarouselImage;
  isReady: boolean;
  item: HomeMosaicItem;
  itemIndex: number;
};

const ENTER_DURATION_SECONDS = 1.12;
const ENTER_STAGGER_SECONDS = 0.028;
const ENTER_STAGGER_SLOTS = 13;

function getMobileLeft(start: number) {
  const columnOffset = start - 1;

  return `calc(${columnOffset * 12.5}vw + ${16 - columnOffset * 2.125}px)`;
}

function getMobileWidth(columns: number) {
  return `calc(${columns * 12.5}vw - ${columns * 2.125 + 15}px)`;
}

function getEntranceDelay(itemIndex: number) {
  const slot = itemIndex % ENTER_STAGGER_SLOTS;
  const staggerIndex =
    slot % 2 === 0
      ? slot / 2
      : Math.ceil(ENTER_STAGGER_SLOTS / 2) + (slot - 1) / 2;

  return staggerIndex * ENTER_STAGGER_SECONDS;
}

export function HomeMosaicCard({
  image,
  isReady,
  item,
  itemIndex,
}: HomeMosaicCardProps) {
  const shouldReduceMotion = useReducedMotion();

  function renderCard(variant: "desktop" | "mobile") {
    const isMobile = variant === "mobile";
    const position = isMobile ? item.mobile : item.desktop;

    return (
      <motion.figure
        animate={{ y: isReady ? 0 : "-100vh" }}
        className={`home-mosaic-card absolute z-[5] m-0 overflow-hidden bg-[#efefed] will-change-transform ${
          isMobile ? "min-[641px]:hidden" : "hidden min-[641px]:block"
        }`}
        data-cursor-label={item.title}
        data-fold-image=""
        data-fold-src={image.src}
        data-hover-image=""
        data-hover-shader=""
        data-hover-src={image.src}
        initial={false}
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
        transition={{
          delay: isReady && !shouldReduceMotion ? getEntranceDelay(itemIndex) : 0,
          duration: shouldReduceMotion ? 0 : ENTER_DURATION_SECONDS,
          ease: [0.65, 0, 0.35, 1],
        }}
      >
        <FoldImage
          image={image}
          sizes="(max-width: 640px) 75vw, (max-width: 1279px) 38vw, 35vw"
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

