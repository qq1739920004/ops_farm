import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path-browserify";
import { fileURLToPath } from 'url'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(dirname, 'src')
    },
    // extensions: ['.js', '.ts', '.vue']
  },
  server: {
    host: "127.0.0.1",
    port: 8088,
    open: true, // 运行是否自动打开浏览器
    proxy: {
      // 反向代理解决跨域
      '/dev-api': {
        // target: "http://vapi.youlai.tech", // 线上接口地址
        // target: 'http://localhost:8989',  // 本地接口地址 , 后端工程仓库地址：https://gitee.com/youlaiorg/youlai-boot
        // target:'http://140.207.166.210:9030',
        target:"http://127.0.0.1:4523/m1/2885822-0-default",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(new RegExp("^/dev-api"), ""), // 替换 /dev-api 为 target 接口地址
          
      },
    },
  },
})
