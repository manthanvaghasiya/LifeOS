import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 1. Increase the warning limit to 1000kb (1MB) to silence the warning
    chunkSizeWarningLimit: 1000, 
    
    // 2. Tell Vite to split vendor libraries (node_modules) into a separate file
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
})