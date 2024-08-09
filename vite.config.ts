// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api', // تأكد من أن هذا هو عنوان الـ API الصحيح
    },
  },
});
