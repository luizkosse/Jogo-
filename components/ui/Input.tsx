import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, className, ...props }, ref) => (
    <div className="relative flex items-center">
      {leftIcon && (
        <span className="absolute left-3 text-text-muted pointer-events-none">
          {leftIcon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full bg-bg-deep border border-white/10 rounded-lg text-text-parchment placeholder:text-text-dim",
          "focus:outline-none focus:border-accent-gold/60 focus:ring-1 focus:ring-accent-gold/30",
          "transition-colors duration-150 h-10 px-3 text-sm",
          leftIcon && "pl-9",
          className
        )}
        {...props}
      />
    </div>
  )
);
Input.displayName = "Input";

export { Input };
