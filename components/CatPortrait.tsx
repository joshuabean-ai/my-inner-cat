import Image from "next/image";

interface CatPortraitProps {
  src: string;
  alt: string;
}

/** The watercolor portrait, washing in like paint settling onto paper. */
export function CatPortrait({ src, alt }: CatPortraitProps) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-cream motion-safe:animate-bloom-in">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 640px) 88vw, 420px"
        className="object-cover"
      />
    </div>
  );
}
