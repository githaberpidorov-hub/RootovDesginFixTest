import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "primary", size = "md", glow = false, children, ...props }, ref) => {
    const baseStyles = "glass-button relative flex items-center justify-center font-medium transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "text-foreground hover:text-foreground",
      secondary: "text-foreground/80 hover:text-foreground border-white/10 hover:border-white/20",
      ghost: "text-foreground/70 hover:text-foreground border-transparent hover:border-white/10",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm rounded-lg",
      md: "px-6 py-3 text-base rounded-xl",
      lg: "px-8 py-4 text-lg rounded-2xl",
    };

    const glowEffect = glow ? "shadow-[0_0_30px_hsla(0,0%,100%,0.2)]" : "";

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          glowEffect,
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 rounded-inherit opacity-0 hover:opacity-100 transition-opacity duration-200">
          <div 
            className="absolute inset-0 rounded-inherit"
            style={{
              background: "linear-gradient(135deg, transparent 0%, hsla(0, 0%, 100%, 0.1) 50%, transparent 100%)",
            }}
          />
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