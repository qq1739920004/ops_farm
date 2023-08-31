import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path-browserify";
import { fileURLToPath } from 'url'
import AutoImport from 'unplugin-auto-import/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const pathSrc = path.resolve(dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
  // AutoImport({
  // Auto import functions from Vue, e.g. ref, reactive, toRef...
  // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
  // imports: ["vue"],

  // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
  // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
  // resolvers: [
  // ElementPlusResolver()
  // ],

  // }),
  createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(pathSrc, "assets/icons")],
    // 指定symbolId格式
    symbolId: "icon-[dir]-[name]",
  }),


  ],
  resolve: {
    alias: {
      "@": pathSrc
    },
  },
  server: {
    host: "127.0.0.1",
    port: 8088,
    open: true, // 运行是否自动打开浏览器
    proxy: {
      // 反向代理解决跨域
      '/dev-api/farmPoint': {
        // target: 'http://140.207.166.210:9030/gateway/farm',
        // target: "http://127.0.0.1:4523/m1/2885822-0-default",
        // target: 'http://140.207.166.210:9030/farm',
        // 位置点测试无网关
        target: 'http://140.207.166.210:9030/farmPoint',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(new RegExp("^/dev-api/farmPoint"), ""), // 替换 /dev-api 为 target 接口地址

      },
      '/dev-api': {
        // target: 'http://140.207.166.210:9030/gateway/farm',
        target: "http://127.0.0.1:4523/m1/2885822-0-default",
        // target: 'http://140.207.166.210:9030/farm',
        // 测试服地址
        // target: "http://127.0.0.1:4523/m1/2885822-0-default",
        // Mock地址
        // target: 'http://140.207.166.210:9030/farm',
        // 位置点测试无网关
        // target:'http://140.207.166.210:9030/farmPoint',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(new RegExp("^/dev-api"), ""), // 替换 /dev-api 为 target 接口地址

      },
    },
  },
})
