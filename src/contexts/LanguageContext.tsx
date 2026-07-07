import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  ready: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  // Flat DB overrides: { 'nav.home': { en, zh } }
  const [overrides, setOverrides] = useState<Record<string, { en: string; zh: string }>>({});
  const [ready, setReady] = useState(false);

  // Load bundled JSON translations (fallback) + DB overrides
  useEffect(() => {
    const load = async () => {
      try {
        const enModule = await import('../locales/en.json');
        const zhModule = await import('../locales/zh.json');
        setTranslations({ en: enModule.default, zh: zhModule.default });
      } catch (error) {
        console.error('Failed to load translations:', error);
      }

      try {
        const { data } = await supabase
          .from('site_content')
          .select('key, value_en, value_zh');
        if (data) {
          const map: Record<string, { en: string; zh: string }> = {};
          for (const row of data as any[]) {
            map[row.key] = { en: row.value_en ?? '', zh: row.value_zh ?? '' };
          }
          setOverrides(map);
        }
      } catch (error) {
        // Non-fatal: fall back to JSON
        console.warn('site_content overrides unavailable, using bundled locales.');
      } finally {
        setReady(true);
      }
    };
    load();
  }, []);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    // DB override takes precedence when it has a non-empty value
    const ov = overrides[key];
    if (ov) {
      const v = language === 'zh' ? ov.zh || ov.en : ov.en || ov.zh;
      if (v) return v;
    }

    if (!translations[language]) return key;

    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return (value as string) || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, ready }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
