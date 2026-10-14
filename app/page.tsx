import {AboutCarousel,
  AboutIntro,
  BrandMark,
  CenterWordmark,
  LocaleClock,} from "./components";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-background px-page py-4 xl:py-page">
      <div className="fixed top-chrome-edge left-chrome-edge z-[80]">
        <BrandMark />
      </div>

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
