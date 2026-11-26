"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ScrollFold } from "../fold-image";
import { ImageHover } from "../image-hover";
import { designsIndexItems } from "./designs-index.items";

const motionEase = [0.65, 0, 0.35, 1] as const;

export function DesignsIndex() {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const activeDesign = designsIndexItems[activeIndex];

  return (
    <section
      aria-labelledby="designs-index-title"
      className="relative min-h-screen"
    >
      <h1 id="designs-index-title" className="sr-only">
        Selected designs
      </h1>

      <ImageHover>
        <ScrollFold>
          <div className="fixed top-1/2 left-1/2 z-[7] hidden max-w-[calc(100vw-4rem)] -translate-x-1/2 -translate-y-1/2 items-center gap-8 min-[981px]:flex">
            <motion.figure
              animate={{ opacity: 1, y: 0 }}
              className="relative h-[312px] w-[232px] shrink-0 overflow-hidden bg-[#efefed]"
              data-cursor-label={activeDesign.title}
              data-hover-image=""
              data-hover-shader=""
              data-hover-src={activeDesign.src}
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 52,
                    }
              }
              transition={{
                delay: shouldReduceMotion ? 0 : 0.15,
                duration: shouldReduceMotion ? 0 : 0.92,
                ease: motionEase,
              }}
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={activeDesign.src}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0"
                  exit={{ opacity: 0, scale: 1.025 }}
                  initial={{
                    opacity: shouldReduceMotion ? 1 : 0,
                    scale: shouldReduceMotion ? 1 : 1.025,
                  }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.34,
                    ease: motionEase,
                  }}
                >
                  <Image
                    alt=""
                    className="object-cover"
                    data-fold-media=""
                    data-hover-media=""
                    draggable={false}
                    fill
                    unoptimized
                    sizes="232px"
                    src={activeDesign.src}
                  />
                </motion.div>
              </AnimatePresence>

              <figcaption className="sr-only">{activeDesign.title}</figcaption>
            </motion.figure>

            <ol className="flex w-max list-none flex-col items-start gap-2">
              {designsIndexItems.map((design, index) => {
                const isActive = activeIndex === index;

                return (
                  <motion.li
                    key={design.title}
                    animate={{ opacity: 1, y: 0 }}
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 18,
                          }
                    }
                    transition={{
                      delay: shouldReduceMotion ? 0 : 0.26 + index * 0.058,
                      duration: shouldReduceMotion ? 0 : 0.64 + index * 0.034,
                      ease: motionEase,
                    }}
                  >
                    <button
                      aria-label={`${design.number} ${design.title}`}
                      aria-pressed={isActive}
                      className={`flex min-h-7.25 cursor-pointer items-center whitespace-nowrap border-0 bg-transparent p-0 text-left text-foreground ${
                        isActive ? "opacity-100" : "opacity-30"
                      }`}
                      onClick={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      onMouseEnter={() => setActiveIndex(index)}
                      type="button"
                    >
                      <span className="mr-2 w-[13px] text-[10px] leading-[1.2] tracking-[-0.02em] opacity-30">
                        {design.number}
                      </span>

                      <span className="text-[24px] leading-[1.2] font-[500] tracking-[-0.05em]">
                        {design.title}
                      </span>

                      <span
                        aria-hidden="true"
                        className={`ml-4 flex items-center gap-4 text-[10px] leading-[1.2] font-[500] tracking-[-0.02em] transition-opacity duration-[180ms] ${
                          isActive ? "opacity-50" : "opacity-0"
                        }`}
                      >
                        <span className="uppercase">{design.location}</span>
                        <span className="uppercase">{design.type}</span>
                        <span className="uppercase">{design.client}</span>
                        <span className="normal-case">{design.year}</span>
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ol>
          </div>

          <div className="relative z-[5] mx-auto flex w-[232px] flex-col gap-8 pt-[max(2rem,calc(50svh-156px))] pb-[max(2rem,calc(50svh-156px))] min-[981px]:hidden">
            {designsIndexItems.map((design) => (
              <article
                key={design.title}
                className="flex flex-col items-center gap-2"
              >
                <figure
                  className="relative w-[232px] overflow-hidden bg-[#efefed]"
                  data-cursor-label={design.title}
                  data-fold-image=""
                  data-fold-src={design.src}
                  data-hover-image=""
                  data-hover-shader=""
                  data-hover-src={design.src}
                  style={{
                    aspectRatio: `232 / ${design.mobileHeight}`,
                  }}
                >
                  <Image
                    alt=""
                    className="object-cover"
                    data-fold-media=""
                    data-hover-media=""
                    draggable={false}
                    fill
                    sizes="232px"
                    src={design.src}
                  />
                </figure>

                <div className="text-center">
                  <h2 className="whitespace-nowrap text-[24px] leading-[1.2] font-[500] tracking-[-0.05em]">
                    {design.title}
                  </h2>

                  <p className="mt-0.5 flex items-center justify-center gap-2 whitespace-nowrap text-[10px] leading-[1.2] font-[500] tracking-[-0.02em]">
                    <span className="uppercase opacity-50">
                      {design.location}
                    </span>

                    <span className="uppercase opacity-50">{design.type}</span>

                    <span className="uppercase opacity-50">
                      {design.client}
                    </span>

                    <span>{design.year}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </ScrollFold>
      </ImageHover>
    </section>
  );
}
