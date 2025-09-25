import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe2Icon } from "lucide-react";

type LanguageCode = "RU" | "ENG" | "UK";

const LANG_STORAGE_KEY = "app_language";

const languages: { code: LanguageCode; label: string }[] = [
  { code: "RU", label: "RU" },
  { code: "ENG", label: "ENG" },
  { code: "UK", label: "UK" },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<LanguageCode>(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem(LANG_STORAGE_KEY) as LanguageCode | null) : null;
    return saved ?? "ENG";
  });

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, current);
    document.documentElement.setAttribute("lang", current.toLowerCase());
  }, [current]);

  const transition = { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] as const };

  return (
    <>
      {/* Single block that expands/contracts; right side shows current language */}
      <motion.div
        role="group"
        aria-label="Language switcher"
        onClick={() => !isOpen && setIsOpen(true)}
        className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-50 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-2xl text-foreground/90 px-4 py-3"
        style={{
          background: "linear-gradient(135deg, hsla(0, 0%, 100%, 0.06) 0%, hsla(220, 20%, 12%, 0.08) 100%)",
          boxShadow: "0 12px 28px hsla(220, 50%, 2%, 0.45), inset 0 1px 0 hsla(0, 0%, 100%, 0.08)",
          cursor: isOpen ? "default" : "pointer",
        }}
        initial={false}
        animate={{ width: isOpen ? 266 : 120 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <motion.div layout className="h-full flex items-center px-2">
          {/* Left cluster: icon + current label always present, moves with layout */}
          <motion.div layout className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Collapse language menu"
              onClick={(e) => { if (isOpen) { e.stopPropagation(); setIsOpen(false); } }}
              className="h-8 w-8 grid place-items-center rounded-xl hover:bg-white/10 transition-colors"
            >
              <Globe2Icon className="h-5 w-5 opacity-90" />
            </button>
            <motion.span
              layout
              className="text-sm font-medium"
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {current}
            </motion.span>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  key="options"
                  className="flex items-center gap-2 ml-1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ when: "beforeChildren", duration: 0.65, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.08 }}
                >
                  {languages.map((lang, index) => {
                    const active = lang.code === current;
                    return (
                      <motion.button
                        key={lang.code}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setCurrent(lang.code); setIsOpen(false); }}
                        className={`h-8 px-2 rounded-xl border text-sm transition-colors ${active ? "bg-white/10 border-white/10" : "border-white/10 hover:bg-white/10"}`}
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


