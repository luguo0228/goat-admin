import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    lightningcss: {
      errorRecovery: true
    }
  },
  server: {
    proxy: {
     
       "/api": {
          target: "http://112.74.48.185:8026",
          changeOrigin: true
          // rewrite: path => path.replace(/^\/api/, "")
        }
    },
  },
})