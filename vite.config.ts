
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // CRITICAL: ./ ensures assets are loaded relatively (e.g. assets/style.css)
  base: './', 
  // CRITICAL: Fix "process is not defined" error in browser
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env': {} 
  },
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
