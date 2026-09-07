import Image, { getImageProps } from "next/image";
import type { HistoryEvent } from "@/lib/content/this-week";

export function HistoryArtwork({ image }: { image: NonNullable<HistoryEvent["image"]> }) {
  if (!image.crop) {
    return <Image src={image.src} alt={image.alt} fill
      sizes="(max-width: 700px) 100vw, 600px" className="week-artwork-image" />;
  }
  const { x, y, width, height } = image.crop;
  const { props } = getImageProps({ src: image.src, alt: image.alt, width: image.width, height: image.height });
  // A viewBox is a window onto the original pixels, preserving the approved art.
  // Next optimises the shared sheet once; each card displays its own rectangle.
  return <svg className="week-artwork-image" viewBox={`${x} ${y} ${width} ${height}`}
    preserveAspectRatio="xMidYMid slice" role="img" aria-label={image.alt}>
    <image href={props.src} width={image.width} height={image.height} />
  </svg>;
}
