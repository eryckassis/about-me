"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Preloader } from "../preloader";
import { SmoothScroll } from "../smooth-scroll";

type HomeExperienceProps = {
  children: ReactNode;
};

const HomeReadyContext = createContext<boolean | undefined>(undefined);

export function HomePreloaderProvider({ children }: HomeExperienceProps) {
  const pathname = usePathname();
  const [shouldPlayPreloader] = useState(() => pathname === "/");
  const [isReady, setIsReady] = useState(!shouldPlayPreloader);

  const handlePreloaderComplete = useCallback(() => {
    setIsReady(true);
  }, []);

  return (
    <HomeReadyContext.Provider value={isReady}>
      {shouldPlayPreloader && !isReady ? (
        <Preloader onComplete={handlePreloaderComplete} />
      ) : null}
      {children}
    </HomeReadyContext.Provider>
  );
}

export function useHomeReady() {
  return useContext(HomeReadyContext);
}

export function HomeExperience({ children }: HomeExperienceProps) {
  useEffect(() => {
    document.documentElement.classList.add("home-scrollbar-hidden");

    return () => {
      document.documentElement.classList.remove("home-scrollbar-hidden");
    };
  }, []);

  return <SmoothScroll>{children}</SmoothScroll>;
}
