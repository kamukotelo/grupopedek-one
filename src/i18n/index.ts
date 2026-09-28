import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import pt from './locales/pt.json';
import en from './locales/en.json';
import fr from './locales/fr.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: pt },
      en: { translation: en },
      fr: { translation: fr }
    },
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
