import { useEffect, useState } from "react";

interface PreventLayoutShiftProps {
  children: React.ReactNode;
  className?: string;
}

const PreventLayoutShift = ({ children, className = "" }: PreventLayoutShiftProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Prevent layout shift by ensuring content is ready
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}>
      {children}
    </div>
  );
};

export default PreventLayoutShift;
