import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "wood-frame rounded-sm p-4 text-ink",
        hover && "transition-transform duration-150 cursor-pointer [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-[inset_0_0_0_2px_var(--color-wood),inset_0_0_0_4px_var(--color-gold-soft),0_3px_0_var(--color-wood-dark)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
