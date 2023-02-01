import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'FileView', // 暴露的全局变量
      fileName: 'file-view', // 输出的包文件名
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue', 'element-plus'],
      globals: {
        vue: 'Vue',
        'element-plus': 'ElementPlus'
      }
    }
  }
})
