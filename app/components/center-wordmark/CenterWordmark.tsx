"use client";

import {
  motion,
  useAnimationControls,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useEffect } from "react";
import { useHomeEntrance } from "../home-experience";

const WORD_DURATION_SECONDS = 0.76;
const WORD_HOLD_MS = 240;

const motionEase = [0.65, 0, 0.35, 1] as const;

const wordmarkClassName =
  "pointer-events-none fixed top-1/2 left-1/2 m-0 -translate-x-1/2 -translate-y-1/2 overflow-hidden whitespace-nowrap bg-transparent font-medium text-[clamp(2.625rem,12vw,4.5rem)] leading-[76px] tracking-[-0.04em] min-[981px]:text-[clamp(3rem,5.14vw,4.625rem)]";

const wordVariants: Variants = {
  hidden: (direction: number) => ({
    y: `${direction * 110}%`,
  }),
  visible: {
    y: "0%",
  },
};

export function CenterWordmark() {
  const entrance = useHomeEntrance();
  const controls = useAnimationControls();
  const shouldReduceMotion = useReducedMotion();

  const phase = entrance?.phase ?? "cards";
  const completeWordmark = entrance?.completeWordmark;
  const isVisible = phase !== "loading";

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    let cancelled = false;
    let holdTimer: number | undefined;

    async function revealWordmark() {
      await controls.start("visible");

      if (cancelled) {
        return;
      }

      holdTimer = window.setTimeout(
        () => {
          if (!cancelled) {
            completeWordmark?.();
          }
        },
        shouldReduceMotion ? 0 : WORD_HOLD_MS,
      );
    }

    void revealWordmark();

    return () => {
      cancelled = true;
      window.clearTimeout(holdTimer);
      controls.stop();
    };
  }, [controls, isVisible, shouldReduceMotion, completeWordmark]);

  const transition = {
    duration: shouldReduceMotion ? 0 : WORD_DURATION_SECONDS,
    ease: motionEase,
  };

  return (
    <>
      <p
        aria-label="Estudio Oassis"
        className={`${wordmarkClassName} z-[1]`}
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <motion.span
          aria-hidden="true"
          animate={controls}
          className="inline-block text-foreground/20"
          custom={1}
          initial="hidden"
          transition={transition}
          variants={wordVariants}
        >
          estudio
        </motion.span>{" "}
        <span aria-hidden="true" className="invisible">
          oassis
        </span>
      </p>

      <p
        aria-hidden="true"
        className={`${wordmarkClassName} z-39 text-background mix-blend-difference`}
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <span className="invisible">estudio</span>{" "}
        <motion.strong
          animate={controls}
          className="inline-block font-medium"
          custom={-1}
          initial="hidden"
          transition={transition}
          variants={wordVariants}
        >
          oassis
        </motion.strong>
      </p>
    </>
  );
}
