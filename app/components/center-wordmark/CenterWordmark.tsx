"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useHomeReady } from "../home-experience";

const wordmarkClassName =
  "pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-transparent font-medium text-[clamp(2.625rem,12vw,4.5rem)] leading-[76px] tracking-[-0.04em] min-[981px]:text-[clamp(3rem,5.14vw,4.625rem)]";

const motionEase = [0.65, 0, 0.35, 1] as const;

export function CenterWordmark() {
  const homeReady = useHomeReady();
  const [isMounted, setIsMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const initialFrame = window.requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => window.cancelAnimationFrame(initialFrame);
  }, []);

  const isVisible = homeReady ?? isMounted;

  const animation = {
    filter: isVisible || shouldReduceMotion ? "blur(0px)" : "blur(8px)",
    opacity: isVisible ? 1 : 0,
    y: isVisible || shouldReduceMotion ? 0 : 18,
  };

  function getTransition(delay: number) {
    return {
      delay: isVisible && !shouldReduceMotion ? delay : 0,
      duration: shouldReduceMotion ? 0 : 0.76,
      ease: motionEase,
    };
  }

  return (
    <>
      <p aria-label="Estudio Bang" className={`${wordmarkClassName} z-[1]`}>
        <motion.span
          animate={animation}
          className="inline-block text-foreground/20"
          initial={false}
          transition={getTransition(0)}
        >
          estudio
        </motion.span>{" "}
        <span aria-hidden="true" className="invisible">
          bang
        </span>
      </p>

      <p
        aria-hidden="true"
        className={`${wordmarkClassName} z-[39] text-background mix-blend-difference`}
      >
        <span className="invisible">estudio</span>{" "}
        <motion.strong
          animate={animation}
          className="inline-block font-medium"
          initial={false}
          transition={getTransition(0.08)}
        >
          bang
        </motion.strong>
      </p>
    </>
  );
}
