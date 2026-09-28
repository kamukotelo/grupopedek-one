import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import pt from './locales/pt.json';

// O português (idioma por omissão e de fallback) segue no bundle principal;
// inglês e francês são chunks separados, descarregados só quando escolhidos.
const lazyLocales: Record<string, () => Promise<{ default: unknown }>> = {
  en: () => import('./locales/en.json'),
  fr: () => import('./locales/fr.json'),
};

export const i18nReady = i18n
  .use(LanguageDetector)
  .use({
    type: 'backend',
    read(language: string, _namespace: string, callback: (error: unknown, data: unknown) => void) {
      const load = lazyLocales[language];
      if (!load) return callback(null, language === 'pt' ? pt : {});
      load().then((module) => callback(null, module.default), (error) => callback(error, null));
    },
  })
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: pt }
    },
    partialBundledLanguages: true,
    fallbackLng: 'pt',
    supportedLngs: ['pt', 'en', 'fr'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie']
    }
  });

// Mantém <html lang> alinhado com o idioma activo (leitores de ecrã, tradução automática, SEO).
const syncDocumentLanguage = (lng: string) => {
  if (typeof document !== 'undefined') document.documentElement.lang = lng.slice(0, 2);
};
syncDocumentLanguage(i18n.resolvedLanguage ?? i18n.language ?? 'pt');
i18n.on('languageChanged', syncDocumentLanguage);

export default i18n;
