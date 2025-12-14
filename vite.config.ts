
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // CRITICAL: Base must be '/' for standard Coolify static hosting
  base: '/',
  build: {
    // CRITICAL: Output directory must be 'dist'
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
  // CRITICAL: Polyfill process.env so the Gemini SDK doesn't crash in browser
  define: {
    'process.env': {}
  },
  server: {
    host: true,
    port: 5173,
  }
})
