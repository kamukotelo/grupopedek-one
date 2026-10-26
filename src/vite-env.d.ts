/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEON_AUTH_URL: string;
  readonly VITE_NEON_DATA_API_URL: string;
  readonly VITE_WHATSAPP_NUMBER: string;
  readonly VITE_CONTACT_EMAIL: string;
}

// Definido em vite.config.ts: identificador desta versão do site.
declare const __BUILD_ID__: string;

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// O build "light" do hls.js (sem legendas/DRM) não traz tipos próprios; a API é a mesma.
declare module 'hls.js/light' {
  export { default } from 'hls.js';
}
