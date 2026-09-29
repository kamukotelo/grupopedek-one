import React from 'react';
import { prerender } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import { App } from './App';
import i18n, { i18nReady } from './i18n';
import { LANDING_LINKS } from './data/seoLandingLinks';
import { VEHICLE_PAGES } from './data/seoVehiclePages';

/** Rotas públicas indexáveis, pré-renderizadas e incluídas no sitemap. */
export const PRERENDER_ROUTES = [
  '/', '/servicos', '/frota', '/reservar', '/quem-somos', '/clientes', '/rotas', '/contactos', '/blogue', '/privacidade',
  ...LANDING_LINKS.map(({ slug }) => `/${slug}`),
  ...VEHICLE_PAGES.map(({ path }) => path),
];

/**
 * Renderização estática usada apenas no build (scripts/prerender.mjs).
 * Gera o HTML de cada rota em português para que motores de busca e
 * pré-visualizações de redes sociais recebam título, descrição, dados
 * estruturados e conteúdo sem depender de JavaScript.
 */
export async function renderRoute(url: string): Promise<string> {
  await i18nReady;
  await i18n.changeLanguage('pt');
  const { prelude } = await prerender(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>,
    // Por omissão o React separa blocos de Suspense com mais de ~12 KB (fallback
    // visível + conteúdo num <div hidden> trocado por script). Queremos HTML
    // final, com o conteúdo já no sítio, para motores de busca e sem JavaScript.
    { progressiveChunkSize: Number.POSITIVE_INFINITY }
  );
  const reader = prelude.getReader();
  const decoder = new TextDecoder();
  let html = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    html += decoder.decode(value, { stream: true });
  }
  return html + decoder.decode();
}
