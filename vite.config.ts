import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import fs from 'fs';

import AutoImport from 'unplugin-auto-import/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import Components from 'unplugin-vue-components/vite'
import topLevelAwait from 'vite-plugin-top-level-await'

const baiduUrl = `https://api.map.baidu.com`;
const nogateway = `https://cloud.sinognss.com/gateway`;

// 自定义插件：生成运行时配置文件
function generateRuntimeConfig(mode) {
  return {
    name: 'generate-runtime-config',
    closeBundle() {
      // 在构建完成后执行，使用传入的mode参数
      const env = loadEnv(mode, process.cwd());
      
      // 配置模板
      const configTemplate = `
window.APP_CONFIG = {
  // 重要提示：如果需要将API请求指向特定服务器，请将相对路径改为完整URL
  // 例如：将 '/gateway' 改为 'http://140.207.166.210:9030/gateway' 或 'https://cloud.sinognss.com/gateway'
  // /gateway与http://140.207.166.210:9030/gateway效果一致，如果只写/gateway那就自动使用当前服务器地址
  
  // 主要API接口地址
  VITE_APP_BASE_API: '${env.VITE_APP_BASE_API || '/gateway'}',
  
  
  // 无网关API地址
  VITE_APP_nogate_API: '${env.VITE_APP_nogate_API || ''}',
  
  // WebSocket连接地址（车辆实时轨迹）
  VITE_APP_BASE_WS: '${env.VITE_APP_BASE_WS || 'ws://140.207.166.210:9034/websocket'}',
  
  // 模式配置
  // 1: 只显示智慧农场菜单，1以外的值: 所有菜单
  VITE_APP_Model: '${env.VITE_APP_Model || '1'}'
};`;

      // 输出目录，使用与build配置相同的逻辑
      console.log('当前构建模式:', mode);
      console.log('加载的环境变量VITE_ENV:', env.VITE_ENV);
      const outputDir = `dist-${env.VITE_ENV}`;
      console.log('输出目录:', outputDir);
      const configPath = path.resolve(process.cwd(), outputDir, 'config.js');
      
      // 确保目录存在并写入配置文件
      if (fs.existsSync(path.dirname(configPath))) {
        fs.writeFileSync(configPath, configTemplate, 'utf8');
        console.log(`✓ 运行时配置文件已生成: ${configPath}`);
      }
    }
  };
}

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
  }),
  // 添加运行时配置生成插件
  generateRuntimeConfig(mode)

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
    // port: 8081,
    open: true, // 运行是否自动打开浏览器
    proxy: {
      // '/dev-api/lu': {
      //   target: 'http://140.143.154.216:9051',
      //   changeOrigin: true,
      //   rewrite: (path) =>
      //     path.replace(new RegExp("^/dev-api"), ""), // 替换 /dev-api 为 target 接口地址
      // },
       '/gateway': { 
          // target: 'http://140.207.166.210:9030',  
          target: 'https://cloud.sinognss.com',  
          changeOrigin: true,
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
