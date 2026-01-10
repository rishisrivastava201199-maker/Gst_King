// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',   // local Express jab chal raha ho
        changeOrigin: true,
        secure: false,
        // rewrite mat daal agar tera local server bhi /send-otp pe hai
        // agar local mein /api/send-otp → /send-otp banana hai to yeh daal:
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})