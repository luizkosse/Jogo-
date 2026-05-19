import { cn } from "@/lib/utils";

type BadgeVariant = "ativo" | "corrigido" | "parcial" | "default";

const variants: Record<BadgeVariant, string> = {
  ativo: "bg-accent-danger/20 text-accent-danger border-accent-danger/30",
  corrigido: "bg-accent-grass/20 text-accent-grass border-accent-grass/30",
  parcial: "bg-accent-gold/20 text-accent-gold border-accent-gold/30",
  default: "bg-white/5 text-text-muted border-white/10",
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
        "inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
