import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    fs: {
      allow: ['.']
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
