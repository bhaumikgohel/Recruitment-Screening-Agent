import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'pdf-lib': ['pdfjs-dist'],
          'docx-lib': ['mammoth']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['pdfjs-dist', 'mammoth'],
    exclude: [] 
  },
  server: {
    // Ensure proper MIME type for .mjs files
    fs: {
      strict: false
    }
  }
})
