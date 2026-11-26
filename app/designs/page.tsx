/* eslint-disable object-curly-newline */
import type { Metadata } from "next";
import {
  DesignsIndex,
  Header,
  HomeFooter,
  LocaleClock,
  SmoothScroll,
} from "../components";

export const metadata: Metadata = {
  title: "Designs | Estudio Bang",
  description: "Selected visual identities, digital and editorial designs.",
};

export default function DesignsPage() {
  return (
    <SmoothScroll>
      <main className="relative min-h-screen overflow-x-clip bg-background">
        <Header />
        <DesignsIndex />
        <LocaleClock />
        <HomeFooter />
      </main>
    </SmoothScroll>
  );
}
