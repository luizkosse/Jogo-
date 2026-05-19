import { cn } from "@/lib/utils";

interface Props {
  /** Nome do arquivo PNG em /public/sprites/npcs/, ex: "alex.png" */
  retrato: string | null | undefined;
  alt: string;
  size?: 48 | 64 | 80 | 128;
  className?: string;
}

const sizeMap: Record<number, string> = {
  48: "h-12 w-12",
  64: "h-16 w-16",
  80: "h-20 w-20",
  128: "h-32 w-32",
};

export function NpcPortrait({ retrato, alt, size = 80, className }: Props) {
  const dimClass = sizeMap[size];

  if (!retrato) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-sm border-2 border-wood-dark/40 bg-paper-deep font-display text-ink-soft",
          dimClass,
          className
        )}
        role="img"
        aria-label={alt}
      >
        <span style={{ fontSize: `${size * 0.5}px`, lineHeight: 1 }}>
          {alt.charAt(0).toUpperCase()}
        </span>
      </span>
    );
  }

  return (
    <img
      src={`/sprites/npcs/${retrato}`}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={cn(
        "rounded-sm border-2 border-wood-dark/40 bg-paper-deep object-cover",
        dimClass,
        className
      )}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
