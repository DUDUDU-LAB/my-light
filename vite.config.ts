import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base 用相对路径：本地 dev 与部署到 Vercel 的产物都走同一份配置
export default defineConfig({
  base: './',
  plugins: [react()],
})