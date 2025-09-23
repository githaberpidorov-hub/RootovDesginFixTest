import { useEffect, useState, useCallback } from "react";
import { useIsMobile } from "./use-mobile";

interface PerformanceConfig {
  enableAnimations: boolean;
  enableParticles: boolean;
  enableComplexEffects: boolean;
  reduceMotion: boolean;
}

export const usePerformance = () => {
  const isMobile = useIsMobile();
  const [config, setConfig] = useState<PerformanceConfig>({
    enableAnimations: true,
    enableParticles: true,
    enableComplexEffects: true,
    reduceMotion: false,
  });

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check device capabilities
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    const isSlowConnection = navigator.connection && 
      (navigator.connection.effectiveType === 'slow-2g' || 
       navigator.connection.effectiveType === '2g');

    setConfig({
      enableAnimations: !prefersReducedMotion && !isLowEndDevice,
      enableParticles: !isMobile && !isLowEndDevice && !isSlowConnection,
      enableComplexEffects: !isMobile && !isLowEndDevice,
      reduceMotion: prefersReducedMotion || isMobile || isLowEndDevice,
    });
  }, [isMobile]);

  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  const throttle = useCallback((func: Function, delay: number) => {
    let lastCall = 0;
    return (...args: any[]) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(null, args);
      }
    };
  }, []);

  return {
    config,
    isMobile,
    debounce,
    throttle,
    // Helper methods
    shouldAnimate: config.enableAnimations,
    shouldShowParticles: config.enableParticles,
    shouldUseComplexEffects: config.enableComplexEffects,
  };
};
