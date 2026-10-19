import {
  aboutCarouselImages,
  type AboutCarouselImage,
} from "../about-carousel";

export type ProjectIndexItem = {
  client: string;
  image: AboutCarouselImage;
  location: string;
  mobileHeight: number;
  number: string;
  title: string;
  type: string;
  year: string;
};

export const projectsIndexItems = [
  {
    number: "01",
    title: "Urban Perspective",
    location: "Villa Gesell Brazil",
    type: "Residential",
    client: "Personal Work",
    year: "2026",
    image: aboutCarouselImages[0],
    mobileHeight: 312,
  },
  {
    number: "02",
    title: "The Shape of Light",
    location: "Urban",
    type: "Landscape",
    client: "Personal Work",
    year: "2026",
    image: aboutCarouselImages[17],
    mobileHeight: 296,
  },
  {
    number: "03",
    title: "Café des arts",
    location: "Paris",
    type: "Editorial",
    client: "Independent",
    year: "2025",
    image: aboutCarouselImages[16],
    mobileHeight: 278,
  },
  {
    number: "04",
    title: "Objects of Desire",
    location: "Studio",
    type: "Product photography",
    client: "Ariatouch",
    year: "2022",
    image: aboutCarouselImages[11],
    mobileHeight: 347,
  },
  {
    number: "05",
    title: "Between Light & shadow",
    location: "Villa Gesell Brazil",
    type: "Editorial Photography",
    client: "Independent",
    year: "2026",
    image: aboutCarouselImages[9],
    mobileHeight: 312,
  },
] satisfies readonly ProjectIndexItem[];
