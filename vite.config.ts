import path from 'node:path'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
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
