import Image from "next/image";
import { getEraImage, type HistoryEra } from "@/lib/content/history";

export function EraPortrait({ era, large = false }: { era: HistoryEra; large?: boolean }) {
  const image = getEraImage(era);
  return (
    <div className={`hx-portrait${large ? " hx-portrait-large" : ""}`}>
      {image ? (
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height}
          sizes={large ? "(min-width: 800px) 160px, 96px" : "(min-width: 800px) 112px, 64px"}
          loading="lazy" />
      ) : (
        <span className="hx-monogram" aria-hidden="true">{era.initials}</span>
      )}
    </div>
  );
}
