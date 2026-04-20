import dheroImg from "@/public/img/1200x400-grayscale.jpg";
import mheroImg from "@/public/img/750x750-grayscale.jpg";
import { getImageProps } from "next/image";

export function ArtDirection() {
  const {
    props: { srcSet: desktopSrcset },
  } = getImageProps({
    alt: "Store Hero Image",
    sizes: "(min-width: 1024px) 1024px, 100vw",
    src: dheroImg,
    width: 1200,
    height: 400,
    quality: 75,
    placeholder: "blur",
  });

  const {
    props: { srcSet: mobileSrcset, ...rest },
  } = getImageProps({
    alt: "Store Hero Image",
    sizes: "100vw",
    src: mheroImg,
    width: 750,
    height: 750,
    quality: 75,
    placeholder: "blur",
  });

  return (
    <picture>
      <source
        media="(min-width: 470px) and (max-width: 767px)"
        srcSet={mobileSrcset}
      />
      <source media="(min-width: 768px)" srcSet={desktopSrcset} />
      <img
        {...rest}
        fetchPriority="high"
        className="object-cover w-full h-full"
        loading="eager"
      />
    </picture>
  );
}
