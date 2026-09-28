import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { DEFAULT_SHARE_IMAGE, OG_LOCALES, SEO_LANGUAGES, localizedUrl } from '../../lib/seo';

/**
 * Metadados comuns a todas as páginas públicas: versões por idioma (hreflang),
 * locale e imagem de partilha Open Graph / Twitter. Título, descrição e
 * canonical continuam a ser definidos por cada página.
 */
export const SeoGlobal: React.FC = () => {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  if (pathname.startsWith('/painel')) return null;

  const current = (i18n.resolvedLanguage ?? 'pt').slice(0, 2) as (typeof SEO_LANGUAGES)[number];
  const locale = OG_LOCALES[current] ?? OG_LOCALES.pt;

  return (
    <Helmet>
      {SEO_LANGUAGES.map((lang) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={localizedUrl(pathname, lang)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={localizedUrl(pathname, 'pt')} />
      <meta property="og:site_name" content="PEPEK GRUPO RENT-A-CAR" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={locale} />
      {SEO_LANGUAGES.filter((lang) => OG_LOCALES[lang] !== locale).map((lang) => (
        <meta key={lang} property="og:locale:alternate" content={OG_LOCALES[lang]} />
      ))}
      <meta property="og:image" content={DEFAULT_SHARE_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="PEPEK GRUPO RENT-A-CAR — Mobilidade premium em Angola" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={DEFAULT_SHARE_IMAGE} />
    </Helmet>
  );
};
