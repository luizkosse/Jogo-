import { cn } from "@/lib/utils";

type TagColor = "grass" | "gold" | "water" | "danger" | "wood" | "muted";

const colors: Record<TagColor, string> = {
  grass: "bg-grass/20 text-grass-dark border-grass-dark/40",
  gold: "bg-gold/25 text-ink-shadow border-wood-dark/40",
  water: "bg-water/20 text-water border-water/40",
  danger: "bg-berry/15 text-berry border-berry/40",
  wood: "bg-wood/15 text-wood-dark border-wood-dark/40",
  muted: "bg-paper-deep text-ink-soft border-wood-dark/30",
};

interface TagProps {
  color?: TagColor;
  className?: string;
  children: React.ReactNode;
}

export function Tag({ color = "muted", className, children }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border-2 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  );
}
