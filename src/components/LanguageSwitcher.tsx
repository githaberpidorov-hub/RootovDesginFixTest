import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe2Icon } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { getAvailableLanguages, getLanguageLabel } from "@/lib/i18n";
import { useIsMobile } from "@/hooks/use-mobile";

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { language: current, setLanguage } = useLanguage();
  const languages = getAvailableLanguages();
  const isMobile = useIsMobile();

  const transition = { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] as const };

  return (
    <>
      {/* Single block that expands/contracts; right side shows current language */}
      <motion.div
        role="group"
        aria-label="Language switcher"
        onClick={() => !isOpen && setIsOpen(true)}
        className={`language-switcher fixed right-4 bottom-4 md:right-6 md:bottom-6 z-50 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-2xl text-foreground/90 px-3 py-2.5 md:px-4 md:py-3.5`}
        style={{
          background: "linear-gradient(135deg, hsla(0, 0%, 100%, 0.06) 0%, hsla(220, 20%, 12%, 0.08) 100%)",
          boxShadow: "0 12px 28px hsla(220, 50%, 2%, 0.45), inset 0 1px 0 hsla(0, 0%, 100%, 0.08)",
          cursor: isOpen ? "default" : "pointer",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          // desktop structure kept; mobile remains a circle when closed via animate below
        }}
        initial={false}
         animate={
           isMobile
             ? { width: isOpen ? 240 : 60, height: 60, borderRadius: 9999 }
             : { width: isOpen ? 270 : 132 }
         }
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {/* Persistent overlay border to avoid disappearing border due to blur/compositing */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{ boxShadow: "inset 0 0 0 1px hsl(var(--border) / 0.8)" }}
        />
        <motion.div layout className={`h-full flex items-center ${isMobile && !isOpen ? "justify-center" : ""} pl-2 pr-0.5`}>
          {/* Left cluster: icon + current label always present, moves with layout */}
          <motion.div layout className={`flex items-center ${isMobile && !isOpen ? "gap-0" : "gap-1"} w-full ml-0.5`}>
            <motion.button
              layout
              type="button"
              aria-label="Collapse language menu"
              onClick={(e) => { if (isOpen) { e.stopPropagation(); setIsOpen(false); } }}
              className={`${isMobile ? "h-9 w-9" : "h-9 w-9"} shrink-0 grid place-items-center rounded-xl transition-colors focus:outline-none ${isMobile ? "active:bg-white/10" : "hover:bg-white/10"}`}
              initial={false}
              animate={{ x: isMobile && !isOpen ? -10 : 0 }}
              transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Globe2Icon className={`h-6 w-6 opacity-90`} />
            </motion.button>
            {/* Desktop keeps label, mobile hides */}
            {isMobile ? (
              <span className="hidden">{getLanguageLabel(current)}</span>
            ) : (
              <motion.span
                layout
                className="text-sm font-medium -ml-px"
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {getLanguageLabel(current)}
              </motion.span>
            )}
            <AnimatePresence>
              {isOpen && (
                <motion.div layout
                  key="options"
                  className={isMobile ? "flex items-center gap-2 ml-1" : "flex items-center gap-2 ml-1"}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ when: "beforeChildren", duration: 0.65, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.08 }}
                >
                  {languages.map((lang, index) => {
                    const active = lang.code === current;
                    return (
                      <motion.button layout
                        key={lang.code}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setLanguage(lang.code); setIsOpen(false); }}
                        className={`h-8 px-2 rounded-xl border text-sm transition-colors backdrop-blur-sm ${active ? "bg-foreground/10 border-foreground/20" : "border-white/10 hover:bg-white/10"}`}
                        style={{
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)"
                        }}
                        initial={{ opacity: 0, x: 12, y: 4, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 12, y: 4, scale: 0.96 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {lang.label}
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* No right-side label while open */}
        </motion.div>
      </motion.div>
    </>
  );
}


