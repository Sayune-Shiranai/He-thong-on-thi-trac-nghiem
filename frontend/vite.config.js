import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,  // frontend chạy port 5173
    proxy: {
      // Mọi request /login, /register, /dashboard/... → chuyển sang backend port 5000
      '/login':     { target: 'http://localhost:5000', changeOrigin: true, secure: false },
      '/register':  { target: 'http://localhost:5000', changeOrigin: true, secure: false },
      '/logout':    { target: 'http://localhost:5000', changeOrigin: true, secure: false },
      '/dashboard': { target: 'http://localhost:5000', changeOrigin: true, secure: false },
      '/exam':      { target: 'http://localhost:5000', changeOrigin: true, secure: false },
      '/question':  { target: 'http://localhost:5000', changeOrigin: true, secure: false },
      '/media':     { target: 'http://localhost:5000', changeOrigin: true, secure: false },
    }
  }
})
