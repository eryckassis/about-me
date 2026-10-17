"use client";

import Image from "next/image";
import type { AboutCarouselImage } from "../about-carousel";

type FoldImageProps = {
  image: AboutCarouselImage;
  sizes: string;
};

export function FoldImage({ image, sizes }: FoldImageProps) {
  return (
    <Image
      alt=""
      className="object-cover"
      data-fold-media=""
      data-hover-media=""
      draggable={false}
      fill
      sizes={sizes}
      src={image.src}
    />
  );
}
