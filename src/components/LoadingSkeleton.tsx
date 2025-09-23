import { motion } from "framer-motion";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "card" | "text" | "image" | "button";
  lines?: number;
}

const LoadingSkeleton = ({ 
  className = "", 
  variant = "card", 
  lines = 3 
}: LoadingSkeletonProps) => {
  const baseClasses = "bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-lg animate-pulse";
  
  const variants = {
    card: "w-full h-64 rounded-3xl",
    text: "h-4 w-full",
    image: "w-full h-48 rounded-2xl",
    button: "h-12 w-32 rounded-2xl"
  };

  if (variant === "text") {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            className={`${baseClasses} ${variants.text}`}
            style={{
              width: `${100 - i * 10}%`,
              animationDelay: `${i * 0.1}s`
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.01, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

export default LoadingSkeleton;
