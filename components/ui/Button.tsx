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
    "bg-accent-gold text-bg-deep font-semibold hover:brightness-110 active:scale-95",
  secondary:
    "bg-bg-twilight text-text-parchment border border-accent-wood hover:bg-bg-night active:scale-95",
  ghost:
    "bg-transparent text-text-parchment hover:bg-bg-twilight active:scale-95",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm rounded",
  md: "h-10 px-4 text-base rounded-md",
  lg: "h-12 px-6 text-lg rounded-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, asChild, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 font-body transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold disabled:opacity-50 disabled:cursor-not-allowed",
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
