import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-force-graph-3d', 'three']
  },
  build: {
    chunkSizeWarningLimit: 1800,
    rollupOptions: {
      output: {
        manualChunks: {
          three:    ['three'],
          fg3d:     ['react-force-graph-3d'],
          react:    ['react', 'react-dom'],
        }
      }
    }
  }
})
