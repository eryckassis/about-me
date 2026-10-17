import { CenterWordmark, Header, HomeFooter, HomeMosaic, LocaleClock } from "./components";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-background">
      <Header />
      <HomeMosaic />
      <CenterWordmark />
      <LocaleClock />
      <HomeFooter />
    </main>
  );
}
