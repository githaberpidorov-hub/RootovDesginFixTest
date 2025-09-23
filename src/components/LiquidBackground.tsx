import { useEffect, useState } from "react";

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

  useEffect(() => {
    const generateShapes = () => {
      const newShapes: Shape[] = [];
      
      // Generate random floating shapes
      for (let i = 0; i < 8; i++) {
        newShapes.push({
          id: i,
          size: Math.random() * 300 + 150,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          delay: Math.random() * 10,
          duration: Math.random() * 15 + 20,
          type: Math.random() > 0.5 ? 'circle' : 'morph',
        });
      }
      
      setShapes(newShapes);
    };

    generateShapes();
    
    const handleResize = () => {
      generateShapes();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 opacity-70">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, hsla(220, 30%, 15%, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, hsla(220, 25%, 10%, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 40% 60%, hsla(0, 0%, 5%, 0.2) 0%, transparent 50%)
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

      {/* Additional glass orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-20"
           style={{
             background: "radial-gradient(circle, hsla(0, 0%, 100%, 0.1) 0%, transparent 70%)",
             filter: "blur(40px)",
             animation: "pulse-glow 12s ease-in-out infinite",
           }} />
      
      <div className="absolute bottom-1/3 left-1/5 w-80 h-80 rounded-full opacity-15"
           style={{
             background: "radial-gradient(circle, hsla(220, 50%, 80%, 0.08) 0%, transparent 70%)",
             filter: "blur(50px)",
             animation: "pulse-glow 15s ease-in-out infinite reverse",
           }} />
    </div>
  );
};

export default LiquidBackground;