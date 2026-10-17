"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import { ImageHover } from "../image-hover";
import { HomeMosaicCard } from "./HomeMosaicCard";
import { homeMosaicItems } from "./home-mosaic.items";

const LOOP_HEIGHT_IN_VIEWPORTS = 416;
const LOOP_COUNT = 3;

function getLoopHeight() {
  return window.innerHeight * (LOOP_HEIGHT_IN_VIEWPORTS / 100);
}

export function HomeMosaic() {
  const isRepositioningRef = useRef(false);

  const lenis = useLenis((instance) => {
    if (isRepositioningRef.current) {
      return;
    }

    const loopHeight = getLoopHeight();
    let nextPosition: number | null = null;

    if (instance.scroll < loopHeight * 0.5) {
      nextPosition = instance.scroll + loopHeight;
    } else if (instance.scroll > loopHeight * 1.5) {
      nextPosition = instance.scroll - loopHeight;
    }

    if (nextPosition === null) {
      return;
    }

    isRepositioningRef.current = true;
    instance.scrollTo(nextPosition, { immediate: true });

    window.requestAnimationFrame(() => {
      isRepositioningRef.current = false;
    });
  });

  useEffect(() => {
    if (!lenis) {
      return;
    }

    const initialFrame = window.requestAnimationFrame(() => {
      if (window.scrollY < getLoopHeight() * 0.5) {
        lenis.scrollTo(window.scrollY + getLoopHeight(), { immediate: true });
      }
    });

    return () => window.cancelAnimationFrame(initialFrame);
  }, [lenis]);

  return (
    <section
      id="home-mosaic"
      aria-labelledby="home-mosaic-title"
      className="relative h-[1248vh] overflow-x-clip"
    >
      <h1 id="home-mosaic-title" className="sr-only">
        Selected work by Estudio Bang
      </h1>

      <ImageHover>
        {Array.from({ length: LOOP_COUNT }, (_, loopIndex) => (
          <div
            key={loopIndex}
            id={loopIndex === 1 ? "home-loop-start" : undefined}
            aria-hidden={loopIndex !== 1}
            className="home-mosaic-cycle absolute inset-x-0 grid h-[416vh] grid-cols-16 gap-x-grid-gutter min-[641px]:inset-x-page"
            style={{ top: `${loopIndex * LOOP_HEIGHT_IN_VIEWPORTS}vh` }}
          >
            {homeMosaicItems.map((item, itemIndex) => {
              const image = item.image;

              if (!image) {
                return null;
              }

              return (
                <HomeMosaicCard
                  key={`${loopIndex}-${itemIndex}-${image.src}`}
                  image={image}
                  item={item}
                />
              );
            })}
          </div>
        ))}
      </ImageHover>
    </section>
  );
}

