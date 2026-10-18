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
    title: "Cortaderas Norte",
    location: "Villa Gesell",
    type: "Residential",
    client: "Arq2G",
    year: "2026",
    image: aboutCarouselImages[0],
    mobileHeight: 312,
  },
  {
    number: "02",
    title: "Qubaa Landscape Interventions",
    location: "Madinah",
    type: "Landscape",
    client: "Bioo",
    year: "2026",
    image: aboutCarouselImages[3],
    mobileHeight: 296,
  },
  {
    number: "03",
    title: "AISEED Training",
    location: "Barcelona",
    type: "Training",
    client: "Estudio Bang",
    year: "2024 - Today",
    image: aboutCarouselImages[9],
    mobileHeight: 278,
  },
  {
    number: "04",
    title: "CutterWay Housing",
    location: "Covina",
    type: "Housing",
    client: "Ariatouch",
    year: "2021",
    image: aboutCarouselImages[11],
    mobileHeight: 347,
  },
  {
    number: "05",
    title: "BREMAR Apartments",
    location: "Villa Gesell",
    type: "Residential",
    client: "Arq2G",
    year: "2017",
    image: aboutCarouselImages[15],
    mobileHeight: 312,
  },
] satisfies readonly ProjectIndexItem[];
