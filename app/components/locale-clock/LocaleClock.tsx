"use client";

import { useEffect, useState } from "react";

type Language = "ENG" | "ESP";

const languages: Language[] = ["ENG", "ESP"];

const clocks = [
  {
    city: "BCN",
    label: "Barcelona",
    timeZone: "Europe/Madrid",
  },
  {
    city: "BUE",
    label: "Buenos Aires",
    timeZone: "America/Argentina/Buenos_Aires",
  },
];

export function getTimeInTimeZone(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).format(date);
}

export function LocaleClock() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("ENG");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const updateClock = () => setCurrentTime(new Date());

    const initialUpdate = window.setTimeout(updateClock, 0);
    const interval = window.setInterval(updateClock, 1000);

    return () => {
      window.clearTimeout(initialUpdate);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <aside
      aria-label="Language and local times"
      className="fixed right-page bottom-page z-20 flex flex-col items-end gap-2 text-[14px] leading-4.25 tracking-[-0.02em]"
    >
      <div
        aria-label={"Language"}
        className="flex items-center gap-2"
        role="group"
      >
        {languages.map((language) => {
          const isSelected = selectedLanguage === language;

          return (
            <button
              key={language}
              aria-pressed={isSelected}
              className={`cursor-pointer font-normal transition-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
                isSelected ? "text-foreground" : "text-foreground/20"
              }`}
              onClick={() => setSelectedLanguage(language)}
              type="button"
            >
              {language}
            </button>
          );
        })}
      </div>

      <ul aria-label="Local times" className="grid">
        {clocks.map((clock) => {
          const time = currentTime
            ? getTimeInTimeZone(currentTime, clock.timeZone)
            : "--:--";

          return (
            <li key={clock.timeZone} className="flex items-center justify-end">
              <span className="mr-1.5">{clock.city}</span>

              <time
                aria-label={`${clock.label}: ${time}`}
                className="min-w-10.5 text-right text-foreground/40 tabular-nums"
                dateTime={currentTime?.toISOString()}
              >
                {time}
              </time>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
