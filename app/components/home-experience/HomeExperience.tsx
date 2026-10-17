"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { Preloader } from "../preloader";
import { SmoothScroll } from "../smooth-scroll";

type HomeExperienceProps = {
  children: ReactNode;
};

const HomeReadyContext = createContext<boolean | undefined>(undefined);

export function useHomeReady() {
  return useContext(HomeReadyContext);
}

export function HomeExperience({ children }: HomeExperienceProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("home-scrollbar-hidden");

    return () => {
      document.documentElement.classList.remove("home-scrollbar-hidden");
    };
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setIsReady(true);
  }, []);

  return (
    <HomeReadyContext.Provider value={isReady}>
      <Preloader onComplete={handlePreloaderComplete} />
      <SmoothScroll>{children}</SmoothScroll>
    </HomeReadyContext.Provider>
  );
}
