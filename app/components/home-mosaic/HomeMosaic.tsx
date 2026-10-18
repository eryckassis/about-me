"use client";

import { useHomeReady } from "../home-experience";
import { ScrollFold } from "../fold-image";
import { ImageHover } from "../image-hover";
import { HomeMosaicCard } from "./HomeMosaicCard";
import { homeMosaicItems } from "./home-mosaic.items";

const LOOP_HEIGHT_IN_VIEWPORTS = 416;
const LOOP_COUNT = 2;

export function HomeMosaic() {
  const isReady = useHomeReady() ?? true;

  return (
    <section
      id="home-mosaic"
      aria-labelledby="home-mosaic-title"
      className="relative h-[516vh] overflow-clip"
    >
      <h1 id="home-mosaic-title" className="sr-only">
        Selected work by Estudio Bang
      </h1>

      <ImageHover>
        <ScrollFold>
          {Array.from({ length: LOOP_COUNT }, (_, loopIndex) => (
            <div
              key={loopIndex}
              id={loopIndex === 0 ? "home-loop-start" : undefined}
              aria-hidden={loopIndex !== 0}
              className="home-mosaic-cycle absolute inset-x-0 h-[416vh] min-[981px]:inset-x-8 min-[981px]:grid min-[981px]:grid-cols-16 min-[981px]:gap-x-8"
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
                    isReady={isReady}
                    item={item}
                    itemIndex={itemIndex}
                  />
                );
              })}
            </div>
          ))}
        </ScrollFold>
      </ImageHover>
    </section>
  );
}
