import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
	plugins: [react(), dts({ entryRoot: 'src' })],
	build: {
		lib: {
			entry: 'src/index.ts',
			name: 'OKVE',
			formats: ['es', 'cjs'],
			fileName: (format) => (format === 'es' ? 'okve.js' : 'okve.cjs')
		},
		rollupOptions: {
			external: ['react', 'react-dom', 'd3'],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
					d3: 'd3'
				}
			}
		}
	}
})
