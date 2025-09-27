import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { addCacheBusting } from "../lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  blur?: boolean;
  forceRefresh?: boolean;
}

const LazyImage = ({ src, alt, className = "", placeholder, blur = true, forceRefresh = false }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const imgRef = useRef<HTMLDivElement>(null);

  // Обновляем src при изменении пропсов
  useEffect(() => {
    const newSrc = addCacheBusting(src, forceRefresh);
    setImageSrc(newSrc);
    setIsLoaded(false); // Сбрасываем состояние загрузки при смене изображения
  }, [src, forceRefresh]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px"
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 animate-pulse">
          {placeholder ? (
            <div className="flex items-center justify-center h-full text-4xl opacity-30">
              {placeholder}
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800/20 to-gray-900/20" />
          )}
        </div>
      )}

      {/* Actual Image */}
      {isInView && (
        <motion.img
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${blur ? "blur-sm" : ""}`}
          style={{
            filter: isLoaded ? "blur(0px)" : "blur(8px)",
            transition: "filter 0.3s ease-out"
          }}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

export default LazyImage;
