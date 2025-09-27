import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/hooks/use-language";

const Navigation = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const { t } = useLanguage();
  const activePath = useMemo(() => {
    const path = location.pathname || "/";
    if (path.startsWith("/portfolio")) return "/portfolio";
    // Treat all other routes (e.g., /request, /admin) as Home for active highlight
    return "/";
  }, [location.pathname]);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const controlNavbar = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Disable auto-hide on mobile for better UX
      if (isMobile) {
        setIsVisible(true);
        return;
      }
      
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  }, [lastScrollY, isMobile]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Throttle scroll events for better performance
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            controlNavbar();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [controlNavbar]);

  const navItems = [
    { name: t.nav.home, path: "/" },
    { name: t.nav.portfolio, path: "/portfolio" },
  ];

  const handleNavClick = (path: string) => {
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0, scale: 0.9 }}
      animate={{ 
        y: isVisible ? 0 : -100, 
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.9
      }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        type: "spring",
        damping: 25,
        stiffness: 300
      }}
      className="fixed top-4 md:top-8 left-0 right-0 mx-auto w-fit z-50 rounded-2xl border-[0.5px] md:border border-white/10 backdrop-blur-3xl px-3 sm:px-4 md:px-6 py-3 md:py-5 max-w-[92vw] overflow-visible"
      style={{
        background: "linear-gradient(135deg, hsla(0, 0%, 100%, 0.03) 0%, hsla(220, 15%, 15%, 0.05) 100%)",
        boxShadow: "0 20px 40px hsla(220, 50%, 2%, 0.4), inset 0 1px 0 hsla(0, 0%, 100%, 0.05)",
      }}
    >
      <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-8">
        {navItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.16, 1, 0.3, 1],
              delay: index * 0.02
            }}
          >
            <motion.div
              initial="idle"
              whileHover="hover"
              className="relative"
              transition={{ scale: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }}
              style={{ willChange: "transform" }}
              variants={{
                idle: { scale: 1 },
                hover: { scale: 1.06 }
              }}
            >
              <Link
                to={item.path}
                className="relative px-4 py-2.5 sm:px-5 sm:py-3 md:px-8 md:py-4 rounded-2xl text-foreground/85 hover:text-foreground transition-all duration-500 group overflow-visible isolate"
                onMouseEnter={() => setHoveredPath(item.path)}
                onMouseLeave={() => setHoveredPath(null)}
                onClick={() => handleNavClick(item.path)}
              >
              <span className="relative z-10 font-medium text-sm sm:text-base md:text-lg tracking-wide">
                {item.name}
              </span>
              
              {/* Background highlight moves together with the shared border */}
              <AnimatePresence>
                {(hoveredPath ? hoveredPath === item.path : activePath === item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 32,
                      mass: 0.9
                    }}
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, hsla(0, 0%, 100%, 0.12) 0%, hsla(220, 15%, 25%, 0.08) 100%)",
                      backdropFilter: "blur(16px)",
                      boxShadow: "0 8px 25px hsla(0, 0%, 100%, 0.1), inset 0 1px 0 hsla(0, 0%, 100%, 0.2)",
                    }}
                  />
                )}
              </AnimatePresence>

              {/* (Removed hover-only glow layer to keep highlight fully synchronized with moving border/background) */}
              

              {/* Shared moving border: appears on hovered item, otherwise on active route */}
              {((hoveredPath && hoveredPath === item.path) || (!hoveredPath && activePath === item.path)) && (
                <motion.div
                  layoutId="navSharedBorder"
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    border: "1px solid hsla(0, 0%, 100%, 0.15)",
                    boxShadow: "inset 0 1px 0 hsla(0, 0%, 100%, 0.2)"
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 32, mass: 0.9 }}
                />
              )}
              </Link>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Floating particles effect removed */}
    </motion.nav>
  );
};

export default Navigation;