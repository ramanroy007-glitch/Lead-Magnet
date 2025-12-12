
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // CRITICAL: ./ ensures assets are loaded relatively (e.g. assets/style.css)
  // This allows the site to work on any domain or subdirectory without configuration.
  base: './', 
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
