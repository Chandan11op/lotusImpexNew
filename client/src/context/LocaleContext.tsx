import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  LocaleCode,
  LocaleDefinition,
  SUPPORTED_LOCALES,
  TranslationDictionary,
} from '../i18n/types';
import { translations } from '../i18n/translations';

interface LocaleContextType {
  currentLocale: LocaleCode;
  localeDef: LocaleDefinition;
  supportedLocales: LocaleDefinition[];
  setLocale: (locale: LocaleCode) => void;
  t: (key: keyof TranslationDictionary) => string;
  isRtl: boolean;
}

const STORAGE_KEY = 'lotus_locale';

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

function detectInitialLocale(): LocaleCode {
  if (typeof window === 'undefined') return 'en';

  // 1. Check saved preference
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as LocaleCode;
    if (saved && SUPPORTED_LOCALES.some((l) => l.code === saved)) {
      return saved;
    }
  } catch {
    // Ignore storage errors
  }

  // 2. Check browser navigator language
  try {
    const navLang = navigator.language.split('-')[0].toLowerCase() as LocaleCode;
    const match = SUPPORTED_LOCALES.find((l) => l.code === navLang);
    if (match) return match.code;
  } catch {
    // Fallback
  }

  return 'en';
}

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocale, setCurrentLocale] = useState<LocaleCode>(detectInitialLocale);

  const localeDef =
    SUPPORTED_LOCALES.find((l) => l.code === currentLocale) || SUPPORTED_LOCALES[0];

  useEffect(() => {
    // Synchronize HTML attributes for language and text direction (RTL support)
    const root = document.documentElement;
    root.lang = currentLocale;
    root.dir = localeDef.dir;

    if (localeDef.dir === 'rtl') {
      root.classList.add('rtl');
    } else {
      root.classList.remove('rtl');
    }
  }, [currentLocale, localeDef]);

  const setLocale = (newLocale: LocaleCode) => {
    if (!SUPPORTED_LOCALES.some((l) => l.code === newLocale)) return;
    setCurrentLocale(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch (e) {
      console.warn('Failed to save locale in localStorage', e);
    }
  };

  const t = (key: keyof TranslationDictionary): string => {
    const dict = translations[currentLocale];
    if (dict && dict[key]) {
      return dict[key];
    }
    // Fallback to English
    return translations.en[key] || key;
  };

  return (
    <LocaleContext.Provider
      value={{
        currentLocale,
        localeDef,
        supportedLocales: SUPPORTED_LOCALES,
        setLocale,
        t,
        isRtl: localeDef.dir === 'rtl',
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
