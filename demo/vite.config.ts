import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      okve: fileURLToPath(new URL('../packages/okve/src/index.ts', import.meta.url)),
    },
  },
})
