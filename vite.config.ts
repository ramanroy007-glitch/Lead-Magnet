
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // CRITICAL: Ensures all assets use relative paths (assets/style.css) instead of absolute (/assets/style.css)
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
        output: {
            manualChunks: (id) => {
                if (id.includes('node_modules')) {
                    if (id.includes('@google/genai')) return 'genai';
                    if (id.includes('react')) return 'react';
                    return 'vendor';
                }
            }
        }
    }
  },
  resolve: {
    alias: {
      '@': '.', 
    },
  },
})
