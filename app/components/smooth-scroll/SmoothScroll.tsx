"use client";

import { cancelFrame, frame } from "framer-motion";
import { ReactLenis, type LenisRef } from "lenis/react";
import { type ReactNode, useEffect, useRef } from "react";

type SmoothScrollProps = {
  children: ReactNode;
  infinite?: boolean;
};

export function SmoothScroll({
  children,
  infinite = false,
}: SmoothScrollProps) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update({ timestamp }: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(timestamp);
    }

    frame.update(update, true);

    return () => cancelFrame(update);
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{ autoRaf: false, infinite, syncTouch: true }}
    >
      {children}
    </ReactLenis>
  );
}
