/* eslint-disable object-curly-newline */
"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Preloader } from "../preloader";
import { SmoothScroll } from "../smooth-scroll";

type HomeExperienceProps = {
  children: ReactNode;
};

type HomeEntrancePhase = "loading" | "wordmark" | "cards";

type HomeEntranceContextValue = {
  phase: HomeEntrancePhase;
  completeWordmark: () => void;
};

const HomeEntranceContext = createContext<HomeEntranceContextValue | undefined>(
  undefined,
);

export function HomePreloaderProvider({ children }: HomeExperienceProps) {
  const pathname = usePathname();

  const [phase, setPhase] = useState<HomeEntrancePhase>(() =>
    pathname === "/" ? "loading" : "cards",
  );

  const handlePreloaderComplete = useCallback(() => {
    setPhase((current) => (current === "loading" ? "wordmark" : current));
  }, []);

  const completeWordmark = useCallback(() => {
    setPhase((current) => (current === "wordmark" ? "cards" : current));
  }, []);

  const activePhase = pathname === "/" ? phase : "cards";

  return (
    <HomeEntranceContext.Provider
      value={{ phase: activePhase, completeWordmark }}
    >
      {activePhase === "loading" ? (
        <Preloader onComplete={handlePreloaderComplete} />
      ) : null}

      {children}
    </HomeEntranceContext.Provider>
  );
}

export function useHomeEntrance() {
  return useContext(HomeEntranceContext);
}

export function useHomeReady() {
  const entrance = useHomeEntrance();

  return entrance ? entrance.phase === "cards" : undefined;
}

function HomeScrollLock({ isLocked }: { isLocked: boolean }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!isLocked) {
      return;
    }

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const wasStopped = lenis?.isStopped ?? false;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    lenis?.stop();

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;

      if (!wasStopped) {
        lenis?.start();
      }
    };
  }, [isLocked, lenis]);

  return null;
}

export function HomeExperience({ children }: HomeExperienceProps) {
  const isReady = useHomeReady() ?? true;

  useEffect(() => {
    document.documentElement.classList.add("home-scrollbar-hidden");

    return () => {
      document.documentElement.classList.remove("home-scrollbar-hidden");
    };
  }, []);

  return (
    <SmoothScroll infinite>
      <HomeScrollLock isLocked={!isReady} />
      {children}
    </SmoothScroll>
  );
}
