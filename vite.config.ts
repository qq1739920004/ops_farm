import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

import AutoImport from 'unplugin-auto-import/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
// import Components from 'unplugin-vue-components/vite'
const requestUrl = `https://api.map.baidu.com/weather/v1/?district_id=222405&data_type=all&ak=YBrHBm564dIAwazUD1lXLGRNFr0AhZCF`;
// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
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
  // Components({
  //   dirs: ['src/components'], // 按需加载的文件夹
  // }),
  createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
    // 指定symbolId格式
    symbolId: "icon-[dir]-[name]",
  }),


  ],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), 'src')
    },
  },
  server: {
    host: "127.0.0.1",
    port: 8088,
    open: true, // 运行是否自动打开浏览器
    proxy: {
      '/dev-api': {
        // target: 'http://140.207.166.210:9030/gateway/farm',
        // target: "http://127.0.0.1:4523/m1/2885822-0-default",
        target: 'http://140.207.166.210:9030/',
        // 测试服地址
        // target: "http://127.0.0.1:4523/m1/2885822-0-default",
        // target: 'http://140.207.166.210:9030',
        // 位置点测试无网关
        // target:'http://140.207.166.210:9030/farmPoint',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(new RegExp("^/dev-api"), ""), // 替换 /dev-api 为 target 接口地址

      },
      '/api-baidu-weather': {
        target: requestUrl,
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(new RegExp("^/api-baidu-weather"), ""), // 替换 /dev-api 为 target 接口地址

      },

    },
  },
})
