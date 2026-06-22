import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // जब भी आप कोड में '/api' से रिक्वेस्ट करेंगे, Vite उसे असली बैकएंड पर भेज देगा
      '/api': {
        target: 'https://api.rrventures.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // '/api' हटा देगा
      },
    },
  },
})
