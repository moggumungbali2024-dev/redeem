import React, { createContext, useContext, useState, useEffect } from 'react';
import { LocalizedString } from './types';

export type Language = 'ko' | 'en' | 'id';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (str: LocalizedString | string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');

  const t = (str: LocalizedString | string) => {
    if (typeof str === 'string') return str;
    return str[lang] || str['en'] || '';
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
};
