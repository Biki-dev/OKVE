import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

const okvePkgPath = fileURLToPath(new URL('../packages/okve/package.json', import.meta.url))
const okveVersion = JSON.parse(readFileSync(okvePkgPath, 'utf-8')).version as string

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  define: {
    __OKVE_VERSION__: JSON.stringify(okveVersion),
  },
  resolve: {
    alias:
      command === 'serve'
        ? {
            // Use local workspace source during dev only.
            '@biki-dev/okve': fileURLToPath(new URL('../packages/okve/src/index.ts', import.meta.url)),
          }
        : undefined,
  },
}))
