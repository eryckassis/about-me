"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { aboutCarouselImages, type AboutCarouselImage } from "../about-carousel";
import { BrandMark } from "../brand-mark";

type PreloaderPhase = "loading" | "burst" | "done";

type BurstTile = {
  rotate: number;
  x: string;
  y: string;
};

const IMAGE_STEP_MS = 180;
const MINIMUM_LOAD_MS = 2220;
const HOLD_AFTER_LOAD_MS = 300;
const BURST_DURATION_MS = 1000;

const burstTiles: readonly BurstTile[] = [
  { x: "-18vw", y: "-160vh", rotate: -4 },
  { x: "-15vw", y: "-170vh", rotate: 5 },
  { x: "-10vw", y: "-180vh", rotate: -6 },
  { x: "-1vw", y: "-190vh", rotate: 7 },
  { x: "6vw", y: "-160vh", rotate: -8 },
  { x: "7vw", y: "-170vh", rotate: 3 },
  { x: "13vw", y: "-180vh", rotate: -5 },
  { x: "24vw", y: "-190vh", rotate: 7 },
];

function preloadImage(image: AboutCarouselImage, onSettled: () => void) {
  return new Promise<void>((resolve) => {
    const element = new window.Image();
    let settled = false;

    function finish() {
      if (settled) {
        return;
      }

      settled = true;
      onSettled();
      resolve();
    }

    element.decoding = "async";
    element.onload = finish;
    element.onerror = finish;
    element.src = image.src;
  });
}

export function Preloader() {
  const shouldReduceMotion = useReducedMotion();

  const [phase, setPhase] = useState<PreloaderPhase>("loading");

  const [, setProgress] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const isVisible = phase !== "done";

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const previousHtmlOverflow = document.documentElement.style.overflow;

    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;

      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isVisible]);

  useEffect(() => {
    const startedAt = Date.now();

    let cancelled = false;
    let loadedImages = 0;

    let exitTimer: number | undefined;
    let finishTimer: number | undefined;

    const imageStepTimer = window.setInterval(() => {
      setActiveImageIndex((currentIndex) =>
        Math.min(currentIndex + 1, aboutCarouselImages.length - 1),
      );
    }, IMAGE_STEP_MS);

    const imageTasks = aboutCarouselImages.map((image) =>
      preloadImage(image, () => {
        loadedImages += 1;

        if (!cancelled) {
          setProgress(
            Math.round((loadedImages / aboutCarouselImages.length) * 100),
          );
        }
      }),
    );

    void Promise.all(imageTasks).then(() => {
      if (cancelled) {
        return;
      }

      const elapsedTime = Date.now() - startedAt;

      const remainingTime = Math.max(0, MINIMUM_LOAD_MS - elapsedTime);

      exitTimer = window.setTimeout(() => {
        if (cancelled) {
          return;
        }

        window.clearInterval(imageStepTimer);

        setProgress(100);

        if (shouldReduceMotion) {
          setPhase("done");
          return;
        }

        setPhase("burst");

        finishTimer = window.setTimeout(() => {
          if (!cancelled) {
            setPhase("done");
          }
        }, BURST_DURATION_MS);
      }, remainingTime + HOLD_AFTER_LOAD_MS);
    });

    return () => {
      cancelled = true;

      window.clearInterval(imageStepTimer);

      if (exitTimer !== undefined) {
        window.clearTimeout(exitTimer);
      }

      if (finishTimer !== undefined) {
        window.clearTimeout(finishTimer);
      }
    };
  }, [shouldReduceMotion]);

  if (!isVisible) {
    return null;
  }

  const currentImage =
    aboutCarouselImages[activeImageIndex] ?? aboutCarouselImages[0];

  if (!currentImage) {
    return null;
  }

  const backgroundImage = `url("${currentImage.src}")`;

  return (
    <div
      aria-label="Loading page"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex min-h-svh items-center justify-center overflow-hidden bg-background"
      role="status"
    >
      <div className="relative aspect-square w-[min(217px,calc((100vw-64px)*0.448))]">
        {phase === "burst"
          ? burstTiles.map((tile, index) => (
              <motion.span
                key={`${tile.x}-${tile.y}`}
                aria-hidden="true"
                className="absolute inset-0 z-[2] bg-cover bg-center will-change-transform"
                initial={{
                  opacity: 1,
                  rotate: 0,
                  scale: 1,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: 1,
                  rotate: tile.rotate,
                  scale: 0.9,
                  x: tile.x,
                  y: tile.y,
                }}
                transition={{
                  delay: index * 0.025,
                  duration: 0.9,
                  ease: [0.72, 0, 1, 1],
                }}
                style={{ backgroundImage }}
              />
            ))
          : null}

        <motion.div
          aria-hidden="true"
          className="relative z-[4] size-full bg-cover bg-center will-change-transform"
          animate={
            phase === "burst"
              ? {
                  rotate: -2,
                  scale: 0.92,
                  y: "-150vh",
                }
              : {
                  rotate: 0,
                  scale: 1,
                  y: 0,
                }
          }
          transition={{
            duration: 0.85,
            ease: [0.72, 0, 1, 1],
          }}
          style={{ backgroundImage }}
        >
          <div className="absolute inset-0 z-[2] grid place-items-center">
            <div className="scale-[1.872] invert">
              <BrandMark />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.p
        aria-hidden="true"
        className="fixed right-4 bottom-[18px] z-[44] m-0 text-[14px] leading-[17px] font-normal tracking-[-0.02em] text-[#2e2e2e] md:right-8 md:bottom-8"
        animate={{
          opacity: phase === "burst" ? 0 : 1,
        }}
        transition={{
          duration: 0.25,
        }}
      ></motion.p>
    </div>
  );
}
