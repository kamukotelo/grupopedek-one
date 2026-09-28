/**
 * Nomes curtos das páginas de destino SEO (src/data/seoLandingPages.ts), usados
 * no rodapé e nos links internos. Ficheiro separado e pequeno para não levar o
 * texto completo das páginas para o bundle principal.
 */
export const LANDING_LINKS: { slug: string; label: Record<'pt' | 'en' | 'fr', string> }[] = [
  { slug: 'aluguer-de-carros-luanda', label: { pt: 'Aluguer de carros em Luanda', en: 'Car rental in Luanda', fr: 'Location de voiture à Luanda' } },
  { slug: 'aluguer-de-carros-com-motorista', label: { pt: 'Carro com motorista', en: 'Car with driver', fr: 'Voiture avec chauffeur' } },
  { slug: 'transfer-aeroporto-luanda', label: { pt: 'Transfer aeroporto Luanda', en: 'Luanda airport transfer', fr: 'Transfert aéroport Luanda' } },
  { slug: 'aluguer-de-carros-de-luxo-angola', label: { pt: 'Carros de luxo e blindados', en: 'Luxury & armoured cars', fr: 'Voitures de luxe et blindées' } },
  { slug: 'aluguer-de-carrinhas-e-vans-angola', label: { pt: 'Aluguer de vans e carrinhas', en: 'Van & minibus rental', fr: 'Location de vans et minibus' } },
  { slug: 'aluguer-de-carros-huambo', label: { pt: 'Aluguer de carros no Huambo', en: 'Car rental in Huambo', fr: 'Location de voiture à Huambo' } },
  { slug: 'rent-a-car-empresas-angola', label: { pt: 'Rent-a-car para empresas', en: 'Corporate car rental', fr: 'Location pour entreprises' } },
];

export const landingLinkLabel = (slug: string, lang: 'pt' | 'en' | 'fr') =>
  LANDING_LINKS.find((link) => link.slug === slug)?.label[lang] ?? slug;
