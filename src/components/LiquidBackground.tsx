import { useEffect, useState, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePerformance } from "@/hooks/use-performance";

interface Shape {
  id: number;
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  type: 'circle' | 'morph';
}

const LiquidBackground = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const isMobile = useIsMobile();
  const { shouldShowParticles, shouldAnimate } = usePerformance();

  const generateShapes = useCallback(() => {
    if (!shouldShowParticles) {
      setShapes([]);
      return;
    }

    const newShapes: Shape[] = [];
    
    // Reduce shapes based on performance settings
    const shapeCount = isMobile ? 2 : shouldShowParticles ? 6 : 8;
    
    // Generate random floating shapes
    for (let i = 0; i < shapeCount; i++) {
      newShapes.push({
        id: i,
        // Smaller shapes on mobile
        size: isMobile ? Math.random() * 150 + 80 : Math.random() * 300 + 150,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: Math.random() * 10,
        duration: Math.random() * 15 + 20,
        type: Math.random() > 0.5 ? 'circle' : 'morph',
      });
    }
    
    setShapes(newShapes);
  }, [isMobile, shouldShowParticles]);

  useEffect(() => {
    generateShapes();
    
    // Debounce resize handler for better performance
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(generateShapes, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [generateShapes]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 opacity-90">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, hsla(220, 12%, 3%, 0.4) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 80%, hsla(220, 8%, 2%, 0.3) 0%, transparent 60%),
              radial-gradient(ellipse at 40% 60%, hsla(220, 6%, 1.5%, 0.2) 0%, transparent 60%),
              radial-gradient(ellipse at 60% 30%, hsla(220, 10%, 4%, 0.15) 0%, transparent 50%)
            `
          }}
        />
      </div>

      {/* Floating liquid shapes */}
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className={`shape-3d ${shape.type === 'morph' ? 'shape-morphing' : ''}`}
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            left: `${shape.x}px`,
            top: `${shape.y}px`,
            animationDelay: `${shape.delay}s`,
            animationDuration: `${shape.duration}s`,
          }}
        >
          <div className="liquid-glow" />
        </div>
      ))}

      {/* Additional glass orbs - ultra dark theme */}
      {shouldShowParticles && !isMobile && (
        <>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-15"
               style={{
                 background: "radial-gradient(circle, hsla(0, 0%, 100%, 0.06) 0%, transparent 70%)",
                 filter: "blur(40px)",
                 animation: shouldAnimate ? "color-pulse 12s ease-in-out infinite" : "none",
               }} />
          
          <div className="absolute bottom-1/3 left-1/5 w-80 h-80 rounded-full opacity-12"
               style={{
                 background: "radial-gradient(circle, hsla(220, 15%, 85%, 0.05) 0%, transparent 70%)",
                 filter: "blur(45px)",
                 animation: shouldAnimate ? "color-pulse 15s ease-in-out infinite reverse" : "none",
               }} />
          
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full opacity-10"
               style={{
                 background: "radial-gradient(circle, hsla(220, 12%, 90%, 0.04) 0%, transparent 70%)",
                 filter: "blur(35px)",
                 animation: shouldAnimate ? "color-shift 18s ease-in-out infinite" : "none",
               }} />
        </>
      )}
    </div>
  );
};

export default LiquidBackground;