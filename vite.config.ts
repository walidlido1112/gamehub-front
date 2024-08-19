import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // استبدل بالـ URL الخاص بالخادم
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
