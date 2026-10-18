"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import type { AboutCarouselImage } from "../about-carousel";
import { FoldImage } from "../fold-image";
import type { HomeMosaicItem } from "./home-mosaic.items";

type HomeMosaicCardProps = {
  image: AboutCarouselImage;
  isReady: boolean;
  item: HomeMosaicItem;
  itemIndex: number;
};

type CardVariant = "desktop" | "tablet" | "mobile";

type GridConfig = {
  edge: number;
  gutter: number;
  maxColumns?: number;
  maxStart?: number;
};

const MOBILE_GRID: GridConfig = {
  edge: 16,
  gutter: 15,
};

const TABLET_GRID: GridConfig = {
  edge: 20,
  gutter: 18,
  maxColumns: 4,
  maxStart: 8,
};

const ENTER_DURATION_SECONDS = 1.12;
const ENTER_STAGGER_SECONDS = 0.028;
const ENTER_STAGGER_SLOTS = 13;

const variantClassNames: Record<CardVariant, string> = {
  mobile: "min-[641px]:hidden",
  tablet: "hidden min-[641px]:block min-[981px]:hidden",
  desktop: "hidden min-[981px]:block",
};

function getResponsiveLeft(start: number, grid: GridConfig) {
  const resolvedStart = Math.min(start, grid.maxStart ?? start);
  const columnOffset = resolvedStart - 1;
  const correction = (grid.edge * 2 - grid.gutter) / 8;

  return `calc(${columnOffset * 12.5}vw + ${
    grid.edge - columnOffset * correction
  }px)`;
}

function getResponsiveWidth(columns: number, grid: GridConfig) {
  const resolvedColumns = Math.min(columns, grid.maxColumns ?? columns);
  const correction = (grid.edge * 2 - grid.gutter) / 8;

  return `calc(${resolvedColumns * 12.5}vw - ${
    resolvedColumns * correction + grid.gutter
  }px)`;
}

function getResponsiveTop(
  value: number,
  widthScale: number,
  viewportUnit: "vh" | "svh",
) {
  const viewportWidthValue = Number((value * widthScale).toFixed(4));
  const comparison = value < 0 ? "min" : "max";

  return `${comparison}(${value}${viewportUnit}, ${viewportWidthValue}vw)`;
}

function getCardStyle(
  item: HomeMosaicItem,
  variant: CardVariant,
): CSSProperties {
  if (variant === "desktop") {
    return {
      aspectRatio: `1 / ${item.desktop.aspectHeightRatio}`,
      gridColumn: `${item.desktop.start} / span ${item.desktop.columns}`,
      top: getResponsiveTop(item.desktop.top, 0.58, "vh"),
      width: "100%",
    };
  }

  const isMobile = variant === "mobile";
  const position = isMobile ? item.mobile : item.desktop;
  const grid = isMobile ? MOBILE_GRID : TABLET_GRID;

  return {
    aspectRatio: `1 / ${position.aspectHeightRatio}`,
    left: getResponsiveLeft(position.start, grid),
    top: getResponsiveTop(
      position.top,
      isMobile ? 1.45 : 0.58,
      isMobile ? "svh" : "vh",
    ),
    width: getResponsiveWidth(position.columns, grid),
  };
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

  function renderCard(variant: CardVariant) {
    return (
      <motion.figure
        animate={{ y: isReady ? 0 : "-100vh" }}
        className={`home-mosaic-card absolute z-[5] m-0 overflow-hidden bg-[#efefed] will-change-transform ${variantClassNames[variant]}`}
        data-cursor-label={item.title}
        data-fold-image=""
        data-fold-src={image.src}
        data-hover-image=""
        data-hover-shader=""
        data-hover-src={image.src}
        initial={false}
        style={getCardStyle(item, variant)}
        transition={{
          delay:
            isReady && !shouldReduceMotion ? getEntranceDelay(itemIndex) : 0,
          duration: shouldReduceMotion ? 0 : ENTER_DURATION_SECONDS,
          ease: [0.65, 0, 0.35, 1],
        }}
      >
        <FoldImage
          image={image}
          sizes="(max-width: 640px) 82vw, (max-width: 980px) 50vw, 35vw"
        />

        <figcaption className="sr-only">{item.title}</figcaption>
      </motion.figure>
    );
  }

  return (
    <>
      {renderCard("mobile")}
      {renderCard("tablet")}
      {renderCard("desktop")}
    </>
  );
}
