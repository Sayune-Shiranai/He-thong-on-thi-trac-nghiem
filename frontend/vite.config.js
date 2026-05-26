import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Tất cả API call dùng prefix /api → forward sang backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Các route không có prefix /api
      '/dashboard': { target: 'http://localhost:3000', changeOrigin: true },
      '/exam':      { target: 'http://localhost:3000', changeOrigin: true },
      '/question':  { target: 'http://localhost:3000', changeOrigin: true },
      '/media':     { target: 'http://localhost:3000', changeOrigin: true },
      '/logout':    { target: 'http://localhost:3000', changeOrigin: true },
    }
  }
})
