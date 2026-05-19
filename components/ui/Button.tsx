import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, Children, cloneElement, forwardRef, isValidElement, ReactElement } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gold text-ink-shadow font-semibold border-2 border-wood-dark shadow-[inset_0_0_0_2px_var(--color-gold-soft),0_2px_0_var(--color-wood-dark)] hover:brightness-105 active:translate-y-px active:shadow-[inset_0_0_0_2px_var(--color-gold-soft),0_0_0_var(--color-wood-dark)]",
  secondary:
    "bg-paper-soft text-ink font-medium border-2 border-wood-dark shadow-[inset_0_0_0_2px_var(--color-wood),0_2px_0_var(--color-wood-dark)] hover:bg-paper-deep active:translate-y-px active:shadow-[inset_0_0_0_2px_var(--color-wood),0_0_0_var(--color-wood-dark)]",
  ghost:
    "bg-transparent text-ink hover:bg-paper-deep border-2 border-transparent active:translate-y-px",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-base",
  lg: "h-12 px-6 text-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, asChild, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 font-body transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-50 disabled:cursor-not-allowed",
      variants[variant],
      sizes[size],
      className
    );

    if (asChild && isValidElement(children)) {
      const child = Children.only(children) as ReactElement<{ className?: string }>;
      return cloneElement(child, {
        ...props,
        className: cn(classes, child.props.className),
      });
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
