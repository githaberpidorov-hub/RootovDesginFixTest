import { motion, MotionProps } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode } from "react";

interface OptimizedMotionProps extends MotionProps {
  children: ReactNode;
  className?: string;
  reduceMotion?: boolean;
  mobileOptimized?: boolean;
}

const OptimizedMotion = ({ 
  children, 
  className = "",
  reduceMotion = false,
  mobileOptimized = true,
  ...motionProps 
}: OptimizedMotionProps) => {
  const isMobile = useIsMobile();

  // Simplified animations for mobile or reduced motion preference
  const shouldReduceMotion = reduceMotion || (isMobile && mobileOptimized);

  const optimizedProps = shouldReduceMotion ? {
    ...motionProps,
    transition: {
      duration: 0.2,
      ease: "easeOut",
      ...motionProps.transition
    },
    // Remove complex animations on mobile
    whileHover: undefined,
    whileTap: undefined,
    drag: undefined,
    dragConstraints: undefined,
  } : {
    ...motionProps,
    // Ensure fast hover transitions
    transition: {
      duration: 0.2,
      ease: "easeOut",
      ...motionProps.transition
    }
  };

  return (
    <motion.div
      className={className}
      {...optimizedProps}
    >
      {children}
    </motion.div>
  );
};

export default OptimizedMotion;
