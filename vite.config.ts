
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // CRITICAL: Sets the base URL to root for proper asset loading on Coolify
  base: '/',
  build: {
    // CRITICAL: Output directory must be 'dist' for Coolify to find the files
    outDir: 'dist',
    emptyOutDir: true,
    // optimize build for production
    sourcemap: false,
  },
  // CRITICAL: Polyfill process.env so the Gemini AI SDK doesn't crash the browser
  define: {
    'process.env': {}
  },
  server: {
    host: true,
    port: 5173,
  }
})
