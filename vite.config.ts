/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['**/*.csv'],
      workbox: {
        globPatterns: ['**/*.{js,css,html}'],
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024, // 20MB
        runtimeCaching: [
          {
            urlPattern: /\.csv$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'csv-cache',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1년
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Hanpyo - 외래어 표기 검색',
        short_name: 'Hanpyo',
        description: '국립국어원 외래어 표기 용례 검색',
        theme_color: '#16a34a',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/hanpyo/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],
  base: '/hanpyo/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
