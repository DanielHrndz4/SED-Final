import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/AddTeacher.php': {
        target: 'http://localhost:8080', // Dirección de tu servidor PHP
        changeOrigin: true,
      },
    },
  },
});