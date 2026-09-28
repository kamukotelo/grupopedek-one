/**
 * Conteúdo do <main> pré-renderizado (scripts/prerender.mjs), guardado antes de o
 * React montar. Serve de fallback do Suspense enquanto o chunk da página
 * carrega, evitando que o HTML já visível pisque para um ecrã vazio.
 */
let snapshot: { route: string; html: string } | null = null;

export const capturePrerenderedMain = (root: HTMLElement) => {
  const route = root.dataset.prerenderedRoute;
  const html = root.querySelector('main')?.innerHTML;
  if (route && html && route === window.location.pathname) snapshot = { route, html };
};

export const getPrerenderedMain = (pathname: string, language: string) =>
  snapshot && snapshot.route === pathname && language.startsWith('pt') ? snapshot.html : null;
