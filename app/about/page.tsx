import type { Metadata } from "next";
import { AboutCarousel, AboutIntro, CenterWordmark, Header, LocaleClock } from "../components";

export const metadata: Metadata = {
  title: "About | Estudio Bang",
  description: "About Estudio Bang and its architecture team.",
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-background px-page py-4 xl:py-page">
      <Header />

      <div className="mx-auto w-full max-w-[var(--layout-mobile-content)] xl:pointer-events-none xl:fixed xl:inset-x-page xl:top-14 xl:z-[20] xl:grid xl:w-auto xl:max-w-none xl:grid-cols-8 xl:gap-x-grid-gutter">
        <div className="xl:pointer-events-auto xl:col-span-2 xl:col-start-1">
          <AboutIntro />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-grid-gutter xl:grid-cols-8">
        <AboutCarousel />
      </div>

      <CenterWordmark />
      <LocaleClock />
    </main>
  );
}
