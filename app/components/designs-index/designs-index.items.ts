/* eslint-disable object-curly-newline */
export type DesignIndexItem = {
  client: string;
  src: string;
  location: string;
  mobileHeight: number;
  number: string;
  title: string;
  type: string;
  year: string;
};

export const designsIndexItems = [
  {
    number: "01",
    title: "Visual Identity",
    location: "Brazil",
    type: "Branding",
    client: "Personal Work",
    year: "2026",
    src: "/images/about-carousel/image-01.png",
    mobileHeight: 312,
  },
  {
    number: "02",
    title: "Digital Experience",
    location: "Studio",
    type: "Web Design",
    client: "Independent",
    year: "2026",
    src: "/images/about-carousel/image-18.jpg",
    mobileHeight: 296,
  },
  {
    number: "03",
    title: "Editorial Studies",
    location: "Studio",
    type: "Editorial",
    client: "Personal Work",
    year: "2026",
    src: "/images/about-carousel/image-17.jpg",
    mobileHeight: 278,
  },
] satisfies readonly DesignIndexItem[];
