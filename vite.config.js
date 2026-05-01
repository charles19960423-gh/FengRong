import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: '/FengRong/',
  build: {
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vue 核心库
          if (id.includes('node_modules/vue') || 
              id.includes('node_modules/vue-router') || 
              id.includes('node_modules/pinia')) {
            return 'vue-vendor'
          }
          // API 库
          if (id.includes('node_modules/axios')) {
            return 'axios-vendor'
          }
          // 工具库
          if (id.includes('node_modules/dompurify')) {
            return 'dompurify-vendor'
          }
        }
      }
    },
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 生成 sourcemap（生产环境可关闭）
    sourcemap: false,
    // 块大小警告限制
    chunkSizeWarningLimit: 1000
  },
  // 开发服务器配置
  server: {
    port: 5175,
    host: '0.0.0.0',
    // 代理配置（可根据需要启用）
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
