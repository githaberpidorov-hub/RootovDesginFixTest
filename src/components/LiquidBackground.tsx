import { useEffect, useState, useCallback, useRef } from "react";
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
  const [cursor, setCursor] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const { shouldShowParticles, shouldAnimate } = usePerformance();

  const generateShapes = useCallback(() => {
    if (!shouldShowParticles) {
      setShapes([]);
      return;
    }

    const newShapes: Shape[] = [];
    // Amount and spacing (чуть меньше)
    const shapeCount = isMobile ? 2 : 6;
    const minDistance = isMobile ? 160 : 220; // px between centers
    const maxAttempts = 200;

    // Rejection sampling to avoid overlaps
    for (let i = 0; i < shapeCount; i++) {
      let attempts = 0;
      let placed = false;
      while (!placed && attempts < maxAttempts) {
        attempts++;
        const size = isMobile ? Math.random() * 140 + 100 : Math.random() * 280 + 160;
        const candidate: Shape = {
          id: i,
          size,
          // генерируем координаты центра, чтобы проще считать ховер и позиционирование
          x: Math.random() * (window.innerWidth - size) + size / 2,
          y: Math.random() * (window.innerHeight - size) + size / 2,
          delay: Math.random() * 10,
          duration: Math.random() * 15 + 24,
          type: Math.random() > 0.5 ? 'circle' : 'morph',
        };
        const ok = newShapes.every(s => {
          const dx = (s.x - candidate.x);
          const dy = (s.y - candidate.y);
          return Math.hypot(dx, dy) > (minDistance + (s.size + candidate.size) * 0.08);
        });
        if (ok) {
          newShapes.push(candidate);
          placed = true;
        }
      }
      if (!placed) {
        // Fallback: push even if overlapping slightly to avoid infinite loop
        newShapes.push({
          id: i,
          size: isMobile ? 180 : 240,
          x: (i + 1) * (window.innerWidth / (shapeCount + 1)),
          y: (i % 2 === 0 ? 0.35 : 0.6) * window.innerHeight,
          delay: Math.random() * 10,
          duration: Math.random() * 15 + 24,
          type: Math.random() > 0.5 ? 'circle' : 'morph',
        });
      }
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

  // Interactive parallax following the cursor (lightweight throttled with rAF)
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setCursor({ x: e.clientX, y: e.clientY });
        // determine hovered shape (closest within radius)
        // hitbox: точный прямоугольник фигуры
        let bestId: number | null = null;
        for (const s of shapes) {
          const left = s.x - s.size / 2;
          const top = s.y - s.size / 2;
          const within = e.clientX >= left && e.clientX <= left + s.size && e.clientY >= top && e.clientY <= top + s.size;
          if (within) { bestId = s.id; break; }
        }
        setHoveredId(bestId);
      });
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

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
      {shouldShowParticles && shapes.map((shape) => {
        // Compute gentle parallax based on cursor distance
        const dx = (cursor.x - shape.x) / (window.innerWidth || 1);
        const dy = (cursor.y - shape.y) / (window.innerHeight || 1);
        const distance = Math.hypot(dx, dy);
        const isHovered = hoveredId === shape.id;
        const intensity = isHovered ? (isMobile ? 10 : 18) : 0; // only hovered moves
        const offsetX = dx * intensity;
        const offsetY = dy * intensity;
        const scale = isHovered ? 1 + Math.max(0.04, 0.08 - distance * 0.1) : 1;
        const transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale.toFixed(3)})`;
        return (
        <div
          key={shape.id}
          className={`shape-3d ${shape.type === 'morph' ? 'shape-morphing' : ''}`}
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            left: `${shape.x - shape.size / 2}px`,
            top: `${shape.y - shape.size / 2}px`,
            animationDelay: `${shape.delay}s`,
            animationDuration: `${shape.duration}s`,
            transform,
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform',
          }}
        >
          <div className="liquid-glow" />
        </div>
        );
      })}

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