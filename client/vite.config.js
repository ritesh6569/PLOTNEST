import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://plotnest.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
    cors: true,
  },
  define: {
    global: 'globalThis',
  },
}); 