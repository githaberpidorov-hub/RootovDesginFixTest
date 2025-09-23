import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSkeleton from "./LoadingSkeleton";

interface PageLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const PageLoader = ({ isLoading, children }: PageLoaderProps) => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Add a small delay to prevent flash
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background flex items-center justify-center"
          >
            <div className="max-w-md mx-auto p-8">
              <div className="text-center mb-8">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-white/10 to-white/5"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <h2 className="text-xl font-semibold text-gradient mb-2">
                  Rootov Design
                </h2>
                <p className="text-foreground/60 text-sm">
                  Загружаем ваш опыт...
                </p>
              </div>
              
              <div className="space-y-4">
                <LoadingSkeleton variant="card" />
                <div className="flex gap-4">
                  <LoadingSkeleton variant="button" className="flex-1" />
                  <LoadingSkeleton variant="button" className="flex-1" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!showLoader && children}
    </>
  );
};

export default PageLoader;
