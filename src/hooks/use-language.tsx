import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { LanguageCode, getTranslations, Translations } from '@/lib/i18n';

const LANG_STORAGE_KEY = "app_language";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LANG_STORAGE_KEY) as LanguageCode | null;
      return saved || "ENG";
    }
    return "ENG";
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
      document.documentElement.setAttribute("lang", lang.toLowerCase());
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LANG_STORAGE_KEY, language);
      document.documentElement.setAttribute("lang", language.toLowerCase());
    }
  }, [language]);

  // First-visit geolocation-based language selection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(LANG_STORAGE_KEY) as LanguageCode | null;
    if (saved) return; // User has a saved preference (auto or manual) — do not re-check

    let cancelled = false;
    const detect = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 3500);
        const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
        window.clearTimeout(timeoutId);
        if (!res.ok) return;
        const data: any = await res.json();
        const country: string = String(data?.country || data?.country_code || "").toUpperCase();
        const next: LanguageCode = country === "UA" ? "UK" : "ENG";
        if (!cancelled) {
          // Persist so we don't check again next visits
          setLanguage(next);
        }
      } catch {
        // On failure, keep default (ENG)
      }
    };

    detect();
    return () => {
      cancelled = true;
    };
  }, []);

  const t = getTranslations(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
