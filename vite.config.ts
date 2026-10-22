import path from 'node:path'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
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
