import { cn } from "@/lib/utils";

type BadgeVariant = "ativo" | "corrigido" | "parcial" | "default";

const variants: Record<BadgeVariant, string> = {
  ativo: "bg-berry/20 text-berry border-berry/50",
  corrigido: "bg-grass/20 text-grass-dark border-grass-dark/50",
  parcial: "bg-gold/30 text-ink-shadow border-wood-dark/40",
  default: "bg-paper-deep text-ink-soft border-wood-dark/30",
};

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border-2 px-2 py-0.5 text-xs font-bold uppercase tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
