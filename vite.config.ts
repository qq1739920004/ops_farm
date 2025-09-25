import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

import AutoImport from 'unplugin-auto-import/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import Components from 'unplugin-vue-components/vite'
import topLevelAwait from 'vite-plugin-top-level-await'

const baiduUrl = `https://api.map.baidu.com`;
const nogateway = `https://cloud.sinognss.com/gateway`;

// https://vitejs.dev/config/
export default ({ mode }) => defineConfig({
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
  Components({
    dirs: ['src/components'], // 按需加载的文件夹
  }),
  createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
    // 指定symbolId格式
    symbolId: "icon-[dir]-[name]",
  }),
  topLevelAwait({
    // The export name of top-level await promise for each chunk module
    promiseExportName: '__tla',
    // The function to generate import names of top-level await promise in each chunk module
    promiseImportName: i => `__tla_${i}`
  })


  ],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), 'src')
    },
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        additionalData: `
          @use "@/styles/variables.scss" as *;
          @use "@/styles/mixin.scss" as *;
        `
      }
    }
  },
  build: {
    outDir: `dist-${loadEnv(mode, process.cwd()).VITE_ENV}`, //指定打包输出路径

  },
  server: {
    host: "0.0.0.0",
    port: 8089,
    open: true, // 运行是否自动打开浏览器
    proxy: {
      '/dev-api/lu': {
        target: 'http://140.143.154.216:9051',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(new RegExp("^/dev-api"), ""), // 替换 /dev-api 为 target 接口地址
      },
      '/dev-apino': {
        target: `http://140.207.166.210:9030`,
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(new RegExp("^/dev-apino"), ""), // 替换 /dev-api 为 target 接口地址
      },
      '/dev-api': {
        // target: "http://127.0.0.1:4523/m1/2885822-0-default",
        // target: 'http://140.207.166.210:9030',
          target: 'http://140.207.166.210:9030/gateway',
       // target:'https://cloud.comnavtech.com/gateway',
        // target: 'http://192.168.2.136/gateway'
          //target: 'https://cloud.sinognss.com/gateway',
        // target: 'https://ads.changfanz.net/gateway',
        //target: 'http://140.207.166.210:9030/gateway/farm',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(new RegExp("^/dev-api"), ""), // 替换 /dev-api 为 target 接口地址
      },

      // 自定义地图服务代理
      '/_AMapService/v4/map/styles': {
        target: 'https://webapi.amap.com/v4/map/styles',
        changeOrigin: true,
        rewrite: (path) => `${path.replace(/^\/_AMapService\/v4\/map\/styles/, '/v4/map/styles')}?jscode=3cb63ed59c6e453ae7acb031f0968686`
      },
      // 海外地图服务代理
      '/_AMapService/v3/vectormap': {
        target: 'https://fmap01.amap.com/v3/vectormap',
        changeOrigin: true,
        rewrite: (path) => `${path.replace(/^\/_AMapService\/v3\/vectormap/, '/v3/vectormap')}?jscode=3cb63ed59c6e453ae7acb031f0968686`
      },
      // Web服务API代理
      '/_AMapService': {
        target: 'https://restapi.amap.com',  // 实际的服务端地址
        changeOrigin: true,  // 改变请求源
        rewrite: (path) => `${path.replace(/^\/_AMapService\//, '/')}?jscode=3cb63ed59c6e453ae7acb031f0968686`  // 重写请求路径
      },
      //百度地图
      '/api-baidu': {
        target: baiduUrl,
        changeOrigin: true,
        rewrite: (path) => `${path.replace(/^\/api-baidu/, '')}`
      },
      '/no-gateway': {
        target: 'https://cloud.sinognss.com',
        changeOrigin: true,
        rewrite: (path) => `${path.replace(/^\/no-gateway/, '')}`
      }
    },
  },
})
