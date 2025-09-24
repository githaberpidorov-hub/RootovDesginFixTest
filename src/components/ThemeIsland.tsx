import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Floating bottom-left island that toggles a "black" theme.
 * Applies the `theme-black` class to the <html> element and persists to localStorage.
 * Plays a radial reveal animation from the bottom-left corner when toggling.
 */
const STORAGE_KEY = "theme-black-enabled";
const THEME_TRANSITION_MS = 800;

const ThemeIsland = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [justToggled, setJustToggled] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  // Load persisted theme (default to dark for all users)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "1" || saved === null) {
      // Default theme: dark
      setEnabled(true);
      document.documentElement.classList.add("theme-black");
      if (saved === null) localStorage.setItem(STORAGE_KEY, "1");
    }
  }, []);

  // Cleanup timer on unmount
  useEffect(() => () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); }, []);

  const toggleTheme = () => {
    const next = !enabled;
    setEnabled(next);
    setJustToggled(true);
    // Add a temporary class to smoothly transition colors across the app
    document.documentElement.classList.add("theme-transition");
    if (next) {
      document.documentElement.classList.add("theme-black");
      localStorage.setItem(STORAGE_KEY, "1");
    } else {
      document.documentElement.classList.remove("theme-black");
      localStorage.removeItem(STORAGE_KEY);
    }
    // Hide overlay after animation completes
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setJustToggled(false);
      document.documentElement.classList.remove("theme-transition");
    }, THEME_TRANSITION_MS + 50);
  };

  const icon = useMemo(() => {
    return enabled ? (
      // Moon icon
      <motion.svg
        key="moon"
        width="22" height="22" viewBox="0 0 24 24" fill="none"
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
      </motion.svg>
    ) : (
      // Sun icon
      <motion.svg
        key="sun"
        width="22" height="22" viewBox="0 0 24 24" fill="none"
        initial={{ rotate: 90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: -90, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l-1.4-1.4M20.4 19.4L19 18M5 19l-1.4 1.4M20.4 4.6L19 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </motion.svg>
    );
  }, [enabled]);

  return (
    <>
      {/* Island */}
      <motion.button
        aria-label="Toggle black theme"
        onClick={toggleTheme}
        className="fixed left-4 bottom-4 md:left-6 md:bottom-6 z-50 rounded-2xl border border-white/10 px-4 py-3 backdrop-blur-2xl text-foreground/90 hover:text-foreground transition-colors"
        style={{
          background: "linear-gradient(135deg, hsla(0, 0%, 100%, 0.06) 0%, hsla(220, 20%, 12%, 0.08) 100%)",
          boxShadow: "0 12px 28px hsla(220, 50%, 2%, 0.45), inset 0 1px 0 hsla(0, 0%, 100%, 0.08)",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">{icon}</AnimatePresence>
          <span className="hidden sm:inline text-sm font-medium">{enabled ? "Чёрная тема" : "Белая тема"}</span>
        </div>
      </motion.button>

      {/* Radial reveal overlay from bottom-left corner */}
      <AnimatePresence>
        {justToggled && (
          <motion.div
            key="theme-overlay"
            className="pointer-events-none fixed inset-0 z-40"
            initial={{ clipPath: "circle(0% at 44px calc(100% - 44px))", opacity: 0.28 }}
            animate={{ clipPath: "circle(180% at 44px calc(100% - 44px))", opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: THEME_TRANSITION_MS / 1000, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ background: enabled ? "#000" : "#0b0e12" }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ThemeIsland;


