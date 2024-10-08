import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  build: {
    sourcemap: false, // Disable source maps
  },
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
  },
});