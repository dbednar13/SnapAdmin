import { URL, fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@constants': fileURLToPath(new URL('./src/constants', import.meta.url)),
      '@components': fileURLToPath(
        new URL('./src/components', import.meta.url)
      ),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9153',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: '../backend/dist/webapp',
    emptyOutDir: true, // Forces Vite to clear the folder before building
  },
});
