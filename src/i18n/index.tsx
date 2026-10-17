import React, { createContext, useContext, useEffect, useState } from 'react';
import { en, type Translations } from './en';
import { bn } from './bn';

export type Language = 'en' | 'bn';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  formatPrice: (amount: number) => string;
  toBengaliNumber: (num: number | string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(val: number | string): string {
  const str = String(val);
  return str.replace(/\d/g, (d) => BENGALI_DIGITS[parseInt(d, 10)]);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Default to English as per specification, or restore persisted preference
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('lashker_preferred_lang');
      if (stored === 'en' || stored === 'bn') return stored;
    } catch {
      // Storage unavailable
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('lashker_preferred_lang', lang);
      document.documentElement.lang = lang;
      if (lang === 'bn') {
        document.body.classList.add('font-bangla');
      } else {
        document.body.classList.remove('font-bangla');
      }
    } catch {
      // Ignore
    }
  };

  const t = language === 'bn' ? bn : en;

  const formatPrice = (amount: number): string => {
    const rounded = Math.round((amount + Number.EPSILON) * 100) / 100;
    const formattedEn = rounded.toLocaleString('en-BD', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    if (language === 'bn') {
      return `৳${toBengaliNumber(formattedEn)}`;
    }
    return `৳${formattedEn}`;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatPrice,
        toBengaliNumber,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
