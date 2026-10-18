import type { Metadata } from "next";
import {
  Header,
  HomeFooter,
  LocaleClock,
  ProjectsIndex,
  SmoothScroll,
} from "../components";

export const metadata: Metadata = {
  title: "Projects | Estudio Bang",
  description: "Selected architecture, landscape, and design projects.",
};

export default function ProjectsPage() {
  return (
    <SmoothScroll>
      <main className="relative min-h-screen overflow-x-clip bg-background">
        <Header />
        <ProjectsIndex />

        <div className="max-[980px]:hidden"></div>

        <LocaleClock />
        <HomeFooter />
      </main>
    </SmoothScroll>
  );
}
