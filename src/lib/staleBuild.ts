import { lazy, type ComponentType } from 'react';

// Depois de cada deploy, os ficheiros JS antigos (com hash no nome) deixam de existir.
// Quem tinha o site aberto — ou uma versão antiga guardada pelo service worker no
// telemóvel — pede esses ficheiros e a página ficava em branco. Aqui deteta-se esse
// caso, limpa-se a cache do site e recarrega-se uma única vez para obter a versão nova.

const RELOAD_KEY = 'pepek:stale-build-reload';
const RELOAD_WINDOW_MS = 30_000;

export const isStaleChunkError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS|Loading chunk [\w-]+ failed|ChunkLoadError/i.test(message);
};

const recentlyReloaded = () => {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    return Date.now() - last < RELOAD_WINDOW_MS;
  } catch {
    return false;
  }
};

/**
 * Remove o service worker e as caches do site e recarrega a página.
 * Devolve false (sem recarregar) se já se tentou há pouco, para nunca entrar em ciclo.
 */
export const recoverFromStaleBuild = (): boolean => {
  if (typeof window === 'undefined' || recentlyReloaded()) return false;
  try { sessionStorage.setItem(RELOAD_KEY, String(Date.now())); } catch { /* modo privado */ }

  const cleanup = async () => {
    try {
      const registrations = await navigator.serviceWorker?.getRegistrations?.() ?? [];
      await Promise.all(registrations.map((registration) => registration.unregister()));
    } catch { /* sem service worker */ }
    try {
      const keys = await caches?.keys?.() ?? [];
      await Promise.all(keys.map((key) => caches.delete(key)));
    } catch { /* sem Cache Storage */ }
  };
  // Não esperar mais de 2 s pela limpeza: o importante é recarregar.
  void Promise.race([cleanup(), new Promise((resolve) => setTimeout(resolve, 2000))]).then(() => window.location.reload());
  return true;
};

/** Como React.lazy, mas recupera sozinho quando o ficheiro da página já não existe. */
export const lazyPage = <T extends ComponentType<any>>(load: () => Promise<{ default: T }>) => lazy(() => load().catch((error: unknown) => {
  // Enquanto a página recarrega, fica pendente (sem piscar um erro).
  if (isStaleChunkError(error) && recoverFromStaleBuild()) return new Promise<{ default: T }>(() => undefined);
  throw error;
}));
