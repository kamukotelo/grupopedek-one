import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon-pepek.png', 'robots.txt'],
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
        // Keep installation light on mobile data. Vehicle and client imagery is
        // loaded when needed instead of forcing every visitor to pre-cache the
        // entire fleet catalogue.
        globPatterns: ['**/*.{js,css,html,ico,svg}'],
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpe?g|webp)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'pepek-visual-assets',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 14 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'unsplash-images', expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 } }
          }
        ]
      }
    })
  ],
  resolve: { alias: { '@': '/src' } }
})
