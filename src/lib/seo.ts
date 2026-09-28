/** Domínio canónico do site (sem barra final). */
export const SITE_URL = 'https://pepekgrupo.com';

/** @id do nó Organization/AutoRental definido no index.html (schema.org). */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** Imagem de partilha 1200×630 usada por omissão em redes sociais. */
export const DEFAULT_SHARE_IMAGE = `${SITE_URL}/og-pepek.jpg`;

export const SEO_LANGUAGES = ['pt', 'en', 'fr'] as const;

export const OG_LOCALES: Record<(typeof SEO_LANGUAGES)[number], string> = {
  pt: 'pt_AO',
  en: 'en_GB',
  fr: 'fr_FR',
};

/** URL absoluto de uma rota numa língua (o idioma é escolhido por ?lng=). */
export const localizedUrl = (pathname: string, lang: (typeof SEO_LANGUAGES)[number]) => {
  const base = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;
  return lang === 'pt' ? base : `${base}?lng=${lang}`;
};
