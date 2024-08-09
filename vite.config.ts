// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Ensure this matches your backend port
    },
  },
  build: {
    rollupOptions: {
      external: ['@fortawesome/fontawesome-svg-core'], // Mark this as external
      output: {
        globals: {
          '@fortawesome/fontawesome-svg-core': '@fortawesome/fontawesome-svg-core',
        },
      },
    },
  },
});
