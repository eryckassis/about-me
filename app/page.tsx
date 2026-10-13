import { AboutIntro, BrandMark } from "./components";

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-page py-page">
      <div className="grid grid-cols-1 gap-x-grid-gutter xl:grid-cols-8">
        <BrandMark />
        <AboutIntro />
      </div>
    </main>
  );
}
