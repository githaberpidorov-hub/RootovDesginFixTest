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
      return saved || "RU";
    }
    return "RU";
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

  const t = getTranslations(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
