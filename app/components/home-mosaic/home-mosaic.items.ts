import { aboutCarouselImages } from "../about-carousel";

type MosaicPosition = {
  aspectHeightRatio: number;
  columns: number;
  start: number;
  top: number;
};

export type HomeMosaicItem = {
  desktop: MosaicPosition;
  imageIndex: number;
  mobile: MosaicPosition;
  title: string;
};

const itemLayouts = [
  {
    title: "Cortaderas Norte",
    imageIndex: 0,
    desktop: { start: 8, columns: 3, top: -14, aspectHeightRatio: 1.19565 },
    mobile: { start: 4, columns: 3, top: 6.7, aspectHeightRatio: 1.19565 },
  },
  {
    title: "Cortaderas Norte",
    imageIndex: 1,
    desktop: { start: 13, columns: 4, top: -10, aspectHeightRatio: 1.196875 },
    mobile: { start: 1, columns: 3, top: 24.8, aspectHeightRatio: 1.34722 },
  },
  {
    title: "Cortaderas Norte",
    imageIndex: 2,
    desktop: { start: 4, columns: 4, top: 22, aspectHeightRatio: 1.196875 },
    mobile: { start: 7, columns: 3, top: 30.5, aspectHeightRatio: 1.19565 },
  },
  {
    title: "Qubaa Landscape Interventions",
    imageIndex: 3,
    desktop: { start: 11, columns: 2, top: 18, aspectHeightRatio: 1.34722 },
    mobile: { start: 7, columns: 7, top: 61.4, aspectHeightRatio: 1.34375 },
  },
  {
    title: "Qubaa Landscape Interventions",
    imageIndex: 4,
    desktop: { start: 12, columns: 4, top: 54, aspectHeightRatio: 1.34375 },
    mobile: { start: -4, columns: 7, top: 59.4, aspectHeightRatio: 1.49679 },
  },
  {
    title: "RAW (Lamp)",
    imageIndex: 5,
    desktop: { start: 1, columns: 3, top: 62, aspectHeightRatio: 1.49565 },
    mobile: { start: 3, columns: 2, top: 59.4, aspectHeightRatio: 1.196875 },
  },
  {
    title: "Carved Panels",
    imageIndex: 6,
    desktop: { start: 5, columns: 2, top: 88, aspectHeightRatio: 1.34722 },
    mobile: { start: 3, columns: 4, top: 81.3, aspectHeightRatio: 1.34706 },
  },
  {
    title: "Shaping Waves",
    imageIndex: 7,
    desktop: { start: 9, columns: 5, top: 118, aspectHeightRatio: 0.66667 },
    mobile: { start: 1, columns: 4, top: 149.4, aspectHeightRatio: 1.34375 },
  },
  {
    title: "Shaping Waves",
    imageIndex: 8,
    desktop: { start: 3, columns: 4, top: 142, aspectHeightRatio: 1.34375 },
    mobile: { start: 5, columns: 3, top: 142.4, aspectHeightRatio: 1.19565 },
  },
  {
    title: "AISEED Training",
    imageIndex: 9,
    desktop: { start: 12, columns: 3, top: 166, aspectHeightRatio: 1.19565 },
    mobile: { start: -2, columns: 5, top: 195.5, aspectHeightRatio: 1.196875 },
  },
  {
    title: "AISEED Training",
    imageIndex: 10,
    desktop: { start: 6, columns: 6, top: 200, aspectHeightRatio: 0.60484 },
    mobile: { start: 4, columns: 5, top: 195.5, aspectHeightRatio: 1.34375 },
  },
  {
    title: "CutterWay Housing",
    imageIndex: 11,
    desktop: { start: 2, columns: 2, top: 232, aspectHeightRatio: 1.34722 },
    mobile: { start: 2, columns: 2, top: 247.1, aspectHeightRatio: 1.34722 },
  },
  {
    title: "CutterWay Housing",
    imageIndex: 12,
    desktop: { start: 11, columns: 4, top: 254, aspectHeightRatio: 1.34375 },
    mobile: { start: 6, columns: 4, top: 253.2, aspectHeightRatio: 1.49565 },
  },
  {
    title: "Parametric Benches",
    imageIndex: 13,
    desktop: { start: 4, columns: 5, top: 284, aspectHeightRatio: 1.19853 },
    mobile: { start: 1, columns: 3, top: 282, aspectHeightRatio: 1.19565 },
  },
  {
    title: "Revolve Lamps",
    imageIndex: 14,
    desktop: { start: 9, columns: 2, top: 320, aspectHeightRatio: 1.34722 },
    mobile: { start: 5, columns: 3, top: 314, aspectHeightRatio: 1.196875 },
  },
  {
    title: "BREMAR Apartments",
    imageIndex: 15,
    desktop: { start: 13, columns: 3, top: 344, aspectHeightRatio: 1.19565 },
    mobile: { start: -3, columns: 6, top: 344, aspectHeightRatio: 1.34375 },
  },
  {
    title: "BREMAR Apartments",
    imageIndex: 2,
    desktop: { start: 1, columns: 4, top: 374, aspectHeightRatio: 1.34375 },
    mobile: { start: 4, columns: 4, top: 378, aspectHeightRatio: 0.66875 },
  },
] satisfies readonly HomeMosaicItem[];

export const homeMosaicItems = itemLayouts.map((item) => ({
  ...item,
  image: aboutCarouselImages[item.imageIndex],
}));

