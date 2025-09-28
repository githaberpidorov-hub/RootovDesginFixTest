import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Floating bottom-left island that lets user select a color theme.
 * Applies a `theme-*` class to <html> and persists to localStorage.
 * Plays a radial reveal animation from the bottom-left corner when switching.
 */
const STORAGE_KEY = "app-color-theme"; // stores class name like: theme-black/theme-white/theme-pink/...
const THEME_TRANSITION_MS = 800;

const THEMES: { id: string; label: string; color: string }[] = [
  { id: "theme-black", label: "Чёрный", color: "#0a0c10" },
  { id: "theme-white", label: "Белый", color: "#ffffff" },
  { id: "theme-pink", label: "Розовый", color: "#ffd6e7" },
  { id: "theme-mint", label: "Мятный", color: "#dcf8ee" },
  { id: "theme-lavender", label: "Лавандовый", color: "#ece7ff" },
  { id: "theme-peach", label: "Персиковый", color: "#ffe9d8" },
];

const ThemeIsland = () => {
  const [current, setCurrent] = useState<string>("theme-black");
  const [open, setOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [justToggled, setJustToggled] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  // Load persisted theme (default to black)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initial = saved && THEMES.some(t => t.id === saved) ? saved : "theme-black";
    setCurrent(initial);
    document.documentElement.classList.add(initial);
    if (!saved) localStorage.setItem(STORAGE_KEY, initial);
  }, []);

  // Detect mobile (match Tailwind sm breakpoint: < 640px)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(!!e.matches);
    // Initialize
    onChange(mq);
    // Listen
    const listener = (e: MediaQueryListEvent) => onChange(e);
    mq.addEventListener ? mq.addEventListener("change", listener) : mq.addListener(listener);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", listener) : mq.removeListener(listener);
    };
  }, []);

  // Cleanup timer on unmount
  useEffect(() => () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); }, []);

  const applyTheme = (themeClass: string) => {
    setJustToggled(true);
    document.documentElement.classList.add("theme-transition");
    // Remove any previous theme-* class
    const classes = document.documentElement.className.split(" ").filter(Boolean);
    classes
      .filter(c => c.startsWith("theme-"))
      .forEach(c => document.documentElement.classList.remove(c));
    document.documentElement.classList.add(themeClass);
    setCurrent(themeClass);
    localStorage.setItem(STORAGE_KEY, themeClass);

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setJustToggled(false);
      document.documentElement.classList.remove("theme-transition");
    }, THEME_TRANSITION_MS + 50);
  };

  const icon = useMemo(() => {
    return (
      <motion.svg
        key={current}
        width="24" height="24" viewBox="0 0 24 24" fill="none"
        style={{ willChange: "transform, opacity" }}
        initial={{ rotate: 90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: -90, opacity: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
      >
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </motion.svg>
    );
  }, [current]);

  return (
    <>
      {/* Floating palette */}
      <div className="fixed left-4 bottom-4 md:left-6 md:bottom-6 z-50">
        <motion.div
          role="group"
          aria-label="Color theme switcher"
          onClick={() => !open && setOpen(true)}
          className="theme-island relative rounded-2xl border border-white/10 px-2.5 py-2 sm:px-3 sm:py-2.5 backdrop-blur-2xl text-foreground/90 overflow-hidden"
          style={{
            background: "var(--gradient-glass)",
            boxShadow: "var(--shadow-glass)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)"
          }}
          initial={false}
          animate={isMobile ? { width: 60, height: open ? 252 : 60, opacity: 1, y: 0 } : { width: open ? 280 : 64, opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          layout
        >
          {/* Persistent overlay border to avoid disappearing border due to blur/compositing */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{ boxShadow: "inset 0 0 0 1px hsl(var(--border) / 0.8)" }}
          />
          <motion.div layout className={`h-full flex items-center ${isMobile ? "flex-col-reverse" : ""}`}>
            <button
              type="button"
              aria-label={open ? "Свернуть палитру" : "Показать палитру"}
              aria-expanded={open}
              onClick={(e) => { if (open) { e.stopPropagation(); setOpen(false); } else { setOpen(true); } }}
              className="relative h-10 w-10 shrink-0 grid place-items-center rounded-full border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
              style={{ 
                transform: `translateX(${isMobile ? "-0.5px" : "-1px"}) translateY(${isMobile ? "-1px" : "-1px"})`,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)"
              }}
            >
              {/* Inner ring */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-px rounded-full"
                style={{ boxShadow: "inset 0 0 0 1px hsl(var(--border) / 0.9)" }}
              />
              <AnimatePresence mode="wait">{icon}</AnimatePresence>
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  key="swatches"
                  className={isMobile ? "flex flex-col items-center gap-2 mb-2" : "flex items-center gap-2 sm:gap-3 ml-2"}
                  initial={{ opacity: 0, x: isMobile ? 0 : 10, y: isMobile ? -10 : 0 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: isMobile ? 0 : 10, y: isMobile ? -10 : 0 }}
                  transition={{ when: "beforeChildren", duration: 0.65, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.06 }}
                >
                  {THEMES.map((t) => (
                    <motion.button
                      key={t.id}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); applyTheme(t.id); }}
                      aria-label={`Выбрать тему: ${t.label}`}
                      className={`h-6 w-6 rounded-full border transition-colors backdrop-blur-sm ${current === t.id ? "ring-2 ring-ring" : "hover:opacity-90"}`}
                      style={{ 
                        backgroundColor: t.color, 
                        borderColor: "hsl(var(--border))",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)"
                      }}
                      initial={{ opacity: 0, x: isMobile ? 0 : 12, y: isMobile ? -8 : 4, scale: 0.96 }}
                      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: isMobile ? 0 : 12, y: isMobile ? -8 : 4, scale: 0.96 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

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
            style={{ background: current === "theme-black" ? "#000" : "#0b0e12" }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ThemeIsland;


