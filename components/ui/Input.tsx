import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, className, ...props }, ref) => (
    <div className="relative flex items-center">
      {leftIcon && (
        <span className="absolute left-3 text-ink-soft pointer-events-none">
          {leftIcon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full bg-paper-soft text-ink placeholder:text-ink-soft/60",
          "border-2 border-wood-dark rounded-sm",
          "shadow-[inset_0_0_0_2px_var(--color-wood-light)]",
          "focus:outline-none focus:shadow-[inset_0_0_0_2px_var(--color-gold)]",
          "transition-shadow duration-100 h-11 px-3 text-sm",
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
