"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { BrandMark } from "../brand-mark";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
] as const;

const motionEase = [0.65, 0, 0.35, 1] as const;

export function Header() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileHomeRef = useRef<HTMLAnchorElement | null>(null);
  const wasMenuOpenRef = useRef(false);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const desktopMediaQuery = window.matchMedia("(min-width: 641px)");

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    function handleBreakpointChange(event: MediaQueryListEvent) {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    desktopMediaQuery.addEventListener("change", handleBreakpointChange);

    const focusFrame = window.requestAnimationFrame(() => {
      mobileHomeRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);

      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;

      window.removeEventListener("keydown", handleKeyDown);
      desktopMediaQuery.removeEventListener("change", handleBreakpointChange);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const wasMenuOpen = wasMenuOpenRef.current;

    wasMenuOpenRef.current = isMenuOpen;

    if (
      wasMenuOpen &&
      !isMenuOpen &&
      window.matchMedia("(max-width: 640px)").matches
    ) {
      menuButtonRef.current?.focus();
    }
  }, [isMenuOpen]);

  function handleNavigation(
    event: MouseEvent<HTMLAnchorElement>,
    href: "/" | "/about" | "/projects",
  ) {
    setIsMenuOpen(false);

    if (href !== "/" || pathname !== "/") {
      return;
    }

    event.preventDefault();

    const homeLoopStart = document.getElementById("home-loop-start");

    window.scrollTo({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      top: homeLoopStart?.offsetTop ?? 0,
    });
  }

  return (
    <>
      <header className="fixed inset-x-chrome-edge top-chrome-edge z-[80] flex items-start justify-between text-background mix-blend-difference">
        <Link
          aria-label="Home"
          className="invert focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-background"
          href="/"
          onClick={(event) => handleNavigation(event, "/")}
        >
          <BrandMark />
        </Link>

        <nav aria-label="Primary navigation">
          <div className="hidden items-center gap-[18px] text-[18px] leading-none font-[500] tracking-[-0.04em] min-[641px]:flex">
            {navigationItems.map((item) => {
              const isActive = item.href === pathname;

              if (!item.href) {
                return (
                  <span
                    key={item.label}
                    aria-disabled="true"
                    className="opacity-20"
                  >
                    {item.label}
                  </span>
                );
              }

              return (
                <Link
                  key={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className={`transition-opacity duration-[240ms] hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-background ${
                    isActive ? "opacity-100" : "opacity-20"
                  }`}
                  href={item.href}
                  onClick={(event) => handleNavigation(event, item.href)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <button
            ref={menuButtonRef}
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            className="cursor-pointer text-[24px] leading-none font-[500] tracking-[-0.04em] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-background min-[641px]:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
            type="button"
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            key="mobile-navigation"
            id="mobile-navigation"
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] text-foreground min-[641px]:hidden"
            data-lenis-prevent=""
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.2,
            }}
          >
            <button
              aria-label="Close navigation menu"
              className="absolute inset-0 cursor-default"
              onClick={() => setIsMenuOpen(false)}
              tabIndex={-1}
              type="button"
            />

            <ul className="absolute top-[62px] right-chrome-edge z-[1] flex w-[min(42vw,156px)] flex-col items-end gap-[9px] text-right text-[24px] leading-none font-[500] tracking-[-0.04em]">
              {navigationItems.map((item, index) => {
                const isActive = item.href === pathname;

                return (
                  <motion.li
                    key={item.label}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden"
                    exit={{
                      opacity: shouldReduceMotion ? 0 : 1,
                      y: shouldReduceMotion ? 0 : "110%",
                    }}
                    initial={{
                      opacity: shouldReduceMotion ? 0 : 1,
                      y: shouldReduceMotion ? 0 : "110%",
                    }}
                    transition={{
                      delay: shouldReduceMotion ? 0 : index * 0.045,
                      duration: shouldReduceMotion ? 0 : 0.45,
                      ease: motionEase,
                    }}
                  >
                    {item.href ? (
                      <Link
                        ref={item.href === "/" ? mobileHomeRef : undefined}
                        aria-current={isActive ? "page" : undefined}
                        className={`transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground ${
                          isActive ? "opacity-100" : "opacity-20"
                        }`}
                        href={item.href}
                        onClick={(event) => handleNavigation(event, item.href)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span aria-disabled="true" className="opacity-20">
                        {item.label}
                      </span>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
