// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://gamehub-backend-5c3f456a5ad4.herokuapp.com', // عنوان خادم Heroku
        changeOrigin: true,
        secure: true, // استخدم true إذا كنت تستخدم HTTPS
      },
    },
  },
});
