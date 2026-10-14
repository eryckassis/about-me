import type { Metadata } from "next";
import localFont from "next/font/local";
import { GrainLayer, SmoothScroll } from "./components";
import "lenis/dist/lenis.css";
import "./globals.css";

const sfProDisplay = localFont({
  src: [
    {
      path: "../public/fonts/SFPRODISPLAYREGULAR.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/SFPRODISPLAYMEDIUM.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro-display",
  display: "swap",
});

const geistPixel = localFont({
  src: "../public/fonts/geist-Pixel.ttf",
  variable: "--font-geist-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "About | Estudio Bang",
  description: "About Estudio Bang and its architecture team.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sfProDisplay.variable} ${geistPixel.variable}`}
    >
      <body className="min-h-screen font-sans antialiased">
        <SmoothScroll>{children}</SmoothScroll>
        <GrainLayer />
      </body>
    </html>
  );
}
