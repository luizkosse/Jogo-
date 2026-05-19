import { cn } from "@/lib/utils";

type TagColor = "grass" | "gold" | "water" | "danger" | "wood" | "muted";

const colors: Record<TagColor, string> = {
  grass: "bg-accent-grass/20 text-accent-grass border-accent-grass/30",
  gold: "bg-accent-gold/20 text-accent-gold border-accent-gold/30",
  water: "bg-accent-water/20 text-accent-water border-accent-water/30",
  danger: "bg-accent-danger/20 text-accent-danger border-accent-danger/30",
  wood: "bg-accent-wood/20 text-accent-wood border-accent-wood/30",
  muted: "bg-white/5 text-text-muted border-white/10",
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
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  );
}
