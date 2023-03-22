import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import svgLoader from 'vite-svg-loader'
import { visualizer } from "rollup-plugin-visualizer"

// https://vitejs.dev/config/
export default defineConfig({
  // base: './',
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://47.94.165.5:8080',
        // target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  },
  plugins: [
    vue(),
    svgLoader(),
    visualizer({
      filename: 'dist/stats.html'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 取node_modules下的第一级文件夹名作为chunk的name
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    },
  },
})
