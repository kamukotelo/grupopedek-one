import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// Páginas internas de revisão da frota (geradas por scripts/generate-fleet-*.mjs).
// Ficam em public/ para se consultarem com `npm run dev`, mas não vão para produção.
// As imagens em fleet-carousel/ são usadas pelo site e mantêm-se no deploy.
const INTERNAL_REVIEW_PAGES = ['fleet-carousel/index.html', 'fleet-migration-beta']

const excludeInternalReviewPages = (): Plugin => ({
  name: 'pepek:exclude-internal-review-pages',
  apply: 'build',
  async writeBundle(options) {
    const outDir = options.dir ?? resolve(process.cwd(), 'dist')
    await Promise.all(INTERNAL_REVIEW_PAGES.map((page) => rm(resolve(outDir, page), { recursive: true, force: true })))
  }
})

// O build SSR (`vite build --ssr src/entry-server.tsx`) só serve para pré-renderizar
// as páginas; não copia public/ nem gera service worker.
// Identificador desta versão do site. A app compara-o com /version.json (sempre da rede)
// para saber que há uma versão nova e recarregar (src/lib/staleBuild.ts).
const BUILD_ID = String(Date.now())

const emitVersionFile = (): Plugin => ({
  name: 'pepek:emit-version-file',
  apply: 'build',
  async writeBundle(options) {
    const outDir = options.dir ?? resolve(process.cwd(), 'dist')
    await writeFile(resolve(outDir, 'version.json'), JSON.stringify({ id: BUILD_ID }))
  }
})

export default defineConfig(({ isSsrBuild }) => ({
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  build: { copyPublicDir: !isSsrBuild },
  plugins: [
    react(),
    tailwindcss(),
    ...(isSsrBuild ? [] : [excludeInternalReviewPages(), emitVersionFile(), VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-pepek.png', 'favicon.ico', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'PEPEK GRUPO RENT-A-CAR',
        short_name: 'PEPEK GRUPO',
        description: 'Mobilidade premium em Angola. Rent-a-car, mobilidade executiva, transfers e soluções corporativas.',
        theme_color: '#06142F',
        background_color: '#06142F',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon-swoosh-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-swoosh-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // Script do próprio service worker: limpa caches estragadas e recarrega as páginas
        // abertas que ainda correm uma versão antiga do site (public/sw-heal.js).
        importScripts: ['sw-heal.js'],
        // As páginas (HTML) vêm sempre da rede: depois de um deploy, o HTML antigo em cache
        // apontava para ficheiros JS que já não existem e a página ficava em branco.
        // Sem rede, usa-se a última cópia guardada (regra 'pepek-pages' abaixo).
        navigateFallback: null,
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // Keep installation light on mobile data. Vehicle and client imagery is
        // loaded when needed instead of forcing every visitor to pre-cache the
        // entire fleet catalogue.
        globPatterns: ['**/*.{js,css,ico,svg}'],
        // Logótipos de clientes e páginas internas de revisão da frota não fazem
        // parte do esqueleto da app; os logótipos entram na cache de imagens ao serem vistos.
        globIgnores: ['clients-color/**', 'fleet-carousel/**'],
        // Pré-cache só do esqueleto da app (os scripts que o index.html carrega).
        // Os chunks lazy — EN/FR, portal, SDK de autenticação, páginas — entram na
        // cache à medida que são usados, em vez de ~2 MB descarregados na instalação.
        manifestTransforms: [
          async (entries) => {
            const html = await readFile(resolve(process.cwd(), 'dist/index.html'), 'utf8')
            const manifest = entries.filter((entry) => !entry.url.startsWith('assets/')
              || !entry.url.endsWith('.js')
              || html.includes(entry.url))
            return { manifest, warnings: [] }
          }
        ],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pepek-pages',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [200] }
            }
          },
          {
            // Ficheiros com hash no nome nunca mudam: servir da cache é seguro.
            urlPattern: /\/assets\/.*\.js$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pepek-lazy-chunks',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /\.(?:png|jpe?g|webp|svg)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              // Nome novo: a cache antiga podia guardar HTML no lugar de imagens (ver main.tsx).
              cacheName: 'pepek-images-v2',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 14 },
              cacheableResponse: { statuses: [200] }
            }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'unsplash-images', expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 } }
          }
        ]
      }
    })])
  ],
  resolve: { alias: { '@': '/src' } }
}))
