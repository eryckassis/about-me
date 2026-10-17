import { CenterWordmark, Header, HomeExperience, HomeFooter, HomeMosaic, LocaleClock } from "./components";

export default function Home() {
  return (
    <HomeExperience>
      <main className="relative min-h-screen overflow-x-clip bg-background">
        <Header />
        <HomeMosaic />
        <CenterWordmark />
        <LocaleClock />
        <HomeFooter />
      </main>
    </HomeExperience>
  );
}
