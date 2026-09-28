/**
 * Pré-renderização estática (SEO) — corre depois de `vite build` e do build SSR.
 *
 * Para cada rota pública gera dist/<rota>.html com o <head> (title, description,
 * canonical, hreflang, Open Graph) e o conteúdo da página já em HTML, para que
 * Google, Bing e as pré-visualizações de WhatsApp/Facebook/LinkedIn vejam a
 * página completa sem executar JavaScript. No browser, o React volta a montar a
 * aplicação por cima (main.tsx remove as tags marcadas com data-static-seo).
 *
 * Também gera dist/spa.html (casca sem conteúdo, usada para rotas desconhecidas)
 * e dist/sitemap.xml com as versões por idioma.
 */
import { readFile, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dist = resolve(root, 'dist');
const SITE = 'https://pepekgrupo.com';

const { renderRoute, PRERENDER_ROUTES } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href);
const template = await readFile(resolve(dist, 'index.html'), 'utf8');

// Casca original para rotas não pré-renderizadas (404, /painel, …).
await writeFile(resolve(dist, 'spa.html'), template);

/** Separa as tags de <head> que o React 19 emite no início do HTML renderizado. */
const splitHead = (html) => {
  const head = [];
  let rest = html;
  for (;;) {
    const match = rest.match(/^(<title[^>]*>[\s\S]*?<\/title>|<(?:meta|link)\b[^>]*\/?>)/);
    if (!match) break;
    head.push(match[1]);
    rest = rest.slice(match[1].length);
  }
  return { head, body: rest };
};

const keepHeadTag = (tag) => {
  if (/^<link\b/.test(tag) && /rel="preload"/.test(tag)) return /fetchPriority="high"/i.test(tag);
  return true;
};

const markStatic = (tag) => tag.replace(/^<(title|meta|link)\b/, '<$1 data-static-seo').replace(' hrefLang=', ' hreflang=');

const failures = [];
for (const route of PRERENDER_ROUTES) {
  const html = await renderRoute(route);
  const { head, body } = splitHead(html);
  const headTags = head.filter(keepHeadTag).map(markStatic);

  const title = head.find((tag) => tag.startsWith('<title'));
  const canonical = head.find((tag) => /rel="canonical"/.test(tag));
  if (!title || !canonical || !/<h1\b/.test(body)) failures.push(`${route}: falta title/canonical/h1`);
  // Conteúdo tem de sair já no sítio: sem fallbacks de Suspense nem segmentos
  // ocultos trocados por script (o Google dá menos peso a texto oculto).
  if (/<template id="B:|hidden id="S:|\$RC\(/.test(body)) failures.push(`${route}: HTML ainda em modo streaming (Suspense por resolver)`);

  const page = template
    // As tags estáticas genéricas do index.html dão lugar às da página.
    .replace(/\s*<(title|meta)\b[^>]*data-static-seo[^>]*>(?:[^<]*<\/title>)?/g, '')
    .replace('</head>', `    ${headTags.join('\n    ')}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root" data-prerendered-route="${route}">${body}</div>`);

  const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
  await writeFile(resolve(dist, file), page);
  console.log(`  prerender ${route.padEnd(40)} → dist/${file} (${Math.round(page.length / 1024)} KB)`);
}

if (failures.length) {
  console.error(`\nPré-renderização incompleta:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

// Sitemap com alternativas por idioma (o idioma escolhe-se por ?lng=).
const today = new Date().toISOString().slice(0, 10);
const loc = (route) => `${SITE}${route === '/' ? '/' : route}`;
const priority = (route) => (route === '/' ? '1.0' : ['/frota', '/servicos', '/reservar', '/contactos'].includes(route) ? '0.9' : route === '/privacidade' ? '0.3' : '0.8');
const alternates = (route) => ['pt', 'en', 'fr']
  .map((lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${lang === 'pt' ? loc(route) : `${loc(route)}?lng=${lang}`}"/>`)
  .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${loc(route)}"/>`)
  .join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${PRERENDER_ROUTES.map((route) => `  <url>
    <loc>${loc(route)}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority(route)}</priority>
${alternates(route)}
  </url>`).join('\n')}
</urlset>
`;
await writeFile(resolve(dist, 'sitemap.xml'), sitemap);
await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`  sitemap.xml com ${PRERENDER_ROUTES.length} URLs`);
