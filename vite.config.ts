import path from 'node:path'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    // PWA "Citas": se instala en el teléfono y abre directo en la agenda.
    // Service worker propio (src/sw.ts) para recibir notificaciones push.
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // Las fotos de alimentos de NutriBot no se guardan en caché.
        globIgnores: ['catalogo/**'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: 'PrecisionCare · Citas',
        short_name: 'PC Citas',
        description: 'Agenda de citas de PrecisionCare',
        lang: 'es',
        start_url: '/agenda',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#001d4a',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
    // Sube los source maps a Sentry en el build; sin SENTRY_AUTH_TOKEN no hace nada.
    // Debe ir al final de los plugins.
    sentryVitePlugin({
      org: 'miguel-lo',
      project: 'precision-care-frontend',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      disable: !process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: { filesToDeleteAfterUpload: ['./dist/**/*.map'] },
    }),
  ],
  build: {
    // 'hidden' genera los .map para Sentry sin referenciarlos desde el bundle público.
    sourcemap: 'hidden',
  },
  server: {
    // Transforma de antemano las rutas y páginas de las features al arrancar el
    // dev server; sin esto, la primera visita a cada página espera a que Vite
    // compile sus módulos (MUI, formularios, etc.) y se siente como un congelón.
    warmup: {
      clientFiles: ['./src/routes/**/*.tsx', './src/features/*/index.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
