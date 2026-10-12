import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Dev: frontend /api/* -> Express server (server/src/index.js :3001)
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 120,
    rollupOptions: {
      output: { manualChunks: { motion: ['framer-motion'] } },
    },
  },
});
