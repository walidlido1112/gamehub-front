// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // تأكد من تطابق المنفذ مع المنفذ الذي يعمل عليه الخادم
    },
  },
  build: {
    rollupOptions: {
      external: ['@fortawesome/fontawesome-svg-core'], // إضافة الحزمة إلى القائمة
    },
  },
});
