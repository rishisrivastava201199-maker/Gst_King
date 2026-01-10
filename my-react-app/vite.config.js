import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 🔴 IMPORTANT: Production (Vercel) ke liye
  base: '/',

  plugins: [react()],

  // 🔵 Sirf LOCAL development ke liye
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
