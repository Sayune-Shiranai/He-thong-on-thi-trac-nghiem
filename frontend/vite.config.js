import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/login':     { target: 'http://localhost:3000', changeOrigin: true },
      '/register':  { target: 'http://localhost:3000', changeOrigin: true },
      '/logout':    { target: 'http://localhost:3000', changeOrigin: true },
      '/dashboard': { target: 'http://localhost:3000', changeOrigin: true },
      '/exam':      { target: 'http://localhost:3000', changeOrigin: true },
      '/question':  { target: 'http://localhost:3000', changeOrigin: true },
      '/media':     { target: 'http://localhost:3000', changeOrigin: true },
    }
  }
})
