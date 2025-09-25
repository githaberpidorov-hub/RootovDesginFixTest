import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "primary", size = "md", glow = false, children, ...props }, ref) => {
    const baseStyles = "glass-button relative flex items-center justify-center font-medium transition-all duration-300 ease-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed border bg-white/5 border-white/10 backdrop-blur-xl shadow-[0_6px_24px_rgba(0,0,0,0.28)] will-change-transform overflow-hidden";
    
    const variants = {
      primary: "text-foreground hover:text-foreground",
      secondary: "text-foreground/80 hover:text-foreground border-white/10 hover:border-white/20",
      ghost: "text-foreground/70 hover:text-foreground border-transparent hover:border-white/10",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    } as const;

    const radius = size === "lg" ? "rounded-full" : size === "sm" ? "rounded-lg" : "rounded-xl";

    const glowEffect = glow ? "shadow-[0_0_30px_hsla(0,0%,100%,0.2)]" : "";

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          radius,
          glowEffect,
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Subtle inner highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit]">
          <div className="absolute inset-px rounded-[inherit]" style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))"
          }} />
        </div>
        
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

GlassButton.displayName = "GlassButton";

export default GlassButton;