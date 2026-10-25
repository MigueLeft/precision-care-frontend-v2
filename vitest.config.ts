import path from 'node:path'
import { defineConfig } from 'vitest/config'

// Pruebas unitarias de funciones puras (sin los plugins de la app).
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
})
