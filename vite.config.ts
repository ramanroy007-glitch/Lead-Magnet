
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Needed for Docker container mapping
    port: 5173,
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: 'dist',
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