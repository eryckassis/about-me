"use client";

import {motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,} from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const wordmarkClassName =
  "pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-transparent font-medium text-[clamp(2.625rem,12vw,4.5rem)] leading-[76px] tracking-[-0.04em] min-[981px]:text-[clamp(3rem,5.14vw,4.625rem)]";

export function CenterWordmark() {
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const syncVisibility = useCallback(() => {
    const isMobile = window.matchMedia("(max-width: 640px)").matches;

    if (!isMobile) {
      setIsVisible(true);
      return;
    }

    const gallery = document.getElementById("about-gallery");
    const triggerPosition = window.innerHeight * 0.4;

    setIsVisible(
      gallery !== null &&
        gallery.getBoundingClientRect().top <= triggerPosition,
    );
  }, []);

  useMotionValueEvent(scrollY, "change", syncVisibility);

  useEffect(() => {
    const initialFrame = window.requestAnimationFrame(syncVisibility);

    window.addEventListener("resize", syncVisibility);

    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.removeEventListener("resize", syncVisibility);
    };
  }, [syncVisibility]);

  const animation = {
    filter: isVisible || shouldReduceMotion ? "blur(0px)" : "blur(8px)",
    opacity: isVisible ? 1 : 0,
  };

  const transition = {
    duration: shouldReduceMotion ? 0 : 0.76,
    ease: [0.65, 0, 0.35, 1] as const,
  };

  return (
    <>
      <motion.p
        initial={false}
        animate={animation}
        transition={transition}
        aria-label="Estudio Bang"
        className={`${wordmarkClassName} z-[1]`}
      >
        <span className="text-foreground/20">estudio</span>{" "}
        <span className="invisible">bang</span>
      </motion.p>

      <motion.p
        initial={false}
        animate={animation}
        transition={transition}
        aria-hidden="true"
        className={`${wordmarkClassName} z-[39] text-background mix-blend-difference`}
      >
        <span className="invisible">estudio</span>{" "}
        <strong className="font-medium">bang</strong>
      </motion.p>
    </>
  );
}
