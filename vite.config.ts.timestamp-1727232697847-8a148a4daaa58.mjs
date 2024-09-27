// vite.config.ts
import { defineConfig } from "file:///C:/Users/user/Desktop/%E5%85%AC%E5%8F%B8project/ops_farm/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/user/Desktop/%E5%85%AC%E5%8F%B8project/ops_farm/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import { createSvgIconsPlugin } from "file:///C:/Users/user/Desktop/%E5%85%AC%E5%8F%B8project/ops_farm/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import topLevelAwait from "file:///C:/Users/user/Desktop/%E5%85%AC%E5%8F%B8project/ops_farm/node_modules/vite-plugin-top-level-await/exports/import.mjs";
var baiduUrl = `https://api.map.baidu.com`;
var vite_config_default = defineConfig({
  base: "./",
  plugins: [
    vue(),
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
      symbolId: "icon-[dir]-[name]"
    }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src")
    }
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/styles/variables.scss";
          @import "@/styles/mixin.scss";
        `
      }
    }
  },
  server: {
    host: "0.0.0.0",
    port: 8089,
    open: true,
    // 运行是否自动打开浏览器
    proxy: {
      "/dev-api/lu": {
        target: "http://140.143.154.216:9051",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(new RegExp("^/dev-api"), "")
        // 替换 /dev-api 为 target 接口地址
      },
      "/dev-apino": {
        target: `http://140.207.166.210:9030`,
        changeOrigin: true,
        rewrite: (path2) => path2.replace(new RegExp("^/dev-apino"), "")
        // 替换 /dev-api 为 target 接口地址
      },
      "/dev-api": {
        // target: "http://127.0.0.1:4523/m1/2885822-0-default",
        // target: 'http://140.207.166.210:9030',
        //target: 'http://140.207.166.210:9030/gateway',
        target: "https://cloud.sinognss.com/gateway",
        //target: 'http://140.207.166.210:9030/gateway/farm',
        changeOrigin: true,
        rewrite: (path2) => path2.replace(new RegExp("^/dev-api"), "")
        // 替换 /dev-api 为 target 接口地址
      },
      // 自定义地图服务代理
      "/_AMapService/v4/map/styles": {
        target: "https://webapi.amap.com/v4/map/styles",
        changeOrigin: true,
        rewrite: (path2) => `${path2.replace(/^\/_AMapService\/v4\/map\/styles/, "/v4/map/styles")}?jscode=3cb63ed59c6e453ae7acb031f0968686`
      },
      // 海外地图服务代理
      "/_AMapService/v3/vectormap": {
        target: "https://fmap01.amap.com/v3/vectormap",
        changeOrigin: true,
        rewrite: (path2) => `${path2.replace(/^\/_AMapService\/v3\/vectormap/, "/v3/vectormap")}?jscode=3cb63ed59c6e453ae7acb031f0968686`
      },
      // Web服务API代理
      "/_AMapService": {
        target: "https://restapi.amap.com",
        // 实际的服务端地址
        changeOrigin: true,
        // 改变请求源
        rewrite: (path2) => `${path2.replace(/^\/_AMapService\//, "/")}?jscode=3cb63ed59c6e453ae7acb031f0968686`
        // 重写请求路径
      },
      //百度地图
      "/api-baidu": {
        target: baiduUrl,
        changeOrigin: true,
        rewrite: (path2) => `${path2.replace(/^\/api-baidu/, "")}`
      },
      "/no-gateway": {
        target: "https://cloud.sinognss.com",
        changeOrigin: true,
        rewrite: (path2) => `${path2.replace(/^\/no-gateway/, "")}`
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx1c2VyXFxcXERlc2t0b3BcXFxcXHU1MTZDXHU1M0Y4cHJvamVjdFxcXFxvcHNfZmFybVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcdXNlclxcXFxEZXNrdG9wXFxcXFx1NTE2Q1x1NTNGOHByb2plY3RcXFxcb3BzX2Zhcm1cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3VzZXIvRGVza3RvcC8lRTUlODUlQUMlRTUlOEYlQjhwcm9qZWN0L29wc19mYXJtL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcblxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbi8vIGltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1zdmctaWNvbnNcIjtcbi8vIGltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgdG9wTGV2ZWxBd2FpdCBmcm9tICd2aXRlLXBsdWdpbi10b3AtbGV2ZWwtYXdhaXQnXG5cbmNvbnN0IGJhaWR1VXJsID0gYGh0dHBzOi8vYXBpLm1hcC5iYWlkdS5jb21gO1xuY29uc3Qgbm9nYXRld2F5ID0gYGh0dHBzOi8vY2xvdWQuc2lub2duc3MuY29tL2dhdGV3YXlgO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYmFzZTogXCIuL1wiLFxuICBwbHVnaW5zOiBbdnVlKCksXG4gIC8vIEF1dG9JbXBvcnQoe1xuICAvLyBBdXRvIGltcG9ydCBmdW5jdGlvbnMgZnJvbSBWdWUsIGUuZy4gcmVmLCByZWFjdGl2ZSwgdG9SZWYuLi5cbiAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IFZ1ZSBcdTc2RjhcdTUxNzNcdTUxRkRcdTY1NzBcdUZGMENcdTU5ODJcdUZGMUFyZWYsIHJlYWN0aXZlLCB0b1JlZiBcdTdCNDlcbiAgLy8gaW1wb3J0czogW1widnVlXCJdLFxuXG4gIC8vIEF1dG8gaW1wb3J0IGZ1bmN0aW9ucyBmcm9tIEVsZW1lbnQgUGx1cywgZS5nLiBFbE1lc3NhZ2UsIEVsTWVzc2FnZUJveC4uLiAod2l0aCBzdHlsZSlcbiAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IEVsZW1lbnQgUGx1cyBcdTc2RjhcdTUxNzNcdTUxRkRcdTY1NzBcdUZGMENcdTU5ODJcdUZGMUFFbE1lc3NhZ2UsIEVsTWVzc2FnZUJveC4uLiAoXHU1RTI2XHU2ODM3XHU1RjBGKVxuICAvLyByZXNvbHZlcnM6IFtcbiAgLy8gRWxlbWVudFBsdXNSZXNvbHZlcigpXG4gIC8vIF0sXG5cbiAgLy8gfSksXG4gIC8vIENvbXBvbmVudHMoe1xuICAvLyAgIGRpcnM6IFsnc3JjL2NvbXBvbmVudHMnXSwgLy8gXHU2MzA5XHU5NzAwXHU1MkEwXHU4RjdEXHU3Njg0XHU2NTg3XHU0RUY2XHU1OTM5XG4gIC8vIH0pLFxuICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XG4gICAgLy8gXHU2MzA3XHU1QjlBXHU5NzAwXHU4OTgxXHU3RjEzXHU1QjU4XHU3Njg0XHU1NkZFXHU2ODA3XHU2NTg3XHU0RUY2XHU1OTM5XG4gICAgaWNvbkRpcnM6IFtwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgXCJzcmMvYXNzZXRzL2ljb25zXCIpXSxcbiAgICAvLyBcdTYzMDdcdTVCOUFzeW1ib2xJZFx1NjgzQ1x1NUYwRlxuICAgIHN5bWJvbElkOiBcImljb24tW2Rpcl0tW25hbWVdXCIsXG4gIH0pLFxuICB0b3BMZXZlbEF3YWl0KHtcbiAgICAvLyBUaGUgZXhwb3J0IG5hbWUgb2YgdG9wLWxldmVsIGF3YWl0IHByb21pc2UgZm9yIGVhY2ggY2h1bmsgbW9kdWxlXG4gICAgcHJvbWlzZUV4cG9ydE5hbWU6ICdfX3RsYScsXG4gICAgLy8gVGhlIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGltcG9ydCBuYW1lcyBvZiB0b3AtbGV2ZWwgYXdhaXQgcHJvbWlzZSBpbiBlYWNoIGNodW5rIG1vZHVsZVxuICAgIHByb21pc2VJbXBvcnROYW1lOiBpID0+IGBfX3RsYV8ke2l9YFxuICB9KVxuXG5cbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMnKVxuICAgIH0sXG4gIH0sXG4gIGNzczoge1xuICAgIC8vIGNzc1x1OTg4NFx1NTkwNFx1NzQwNlx1NTY2OFxuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIHNjc3M6IHtcbiAgICAgICAgYWRkaXRpb25hbERhdGE6IGBcbiAgICAgICAgICBAaW1wb3J0IFwiQC9zdHlsZXMvdmFyaWFibGVzLnNjc3NcIjtcbiAgICAgICAgICBAaW1wb3J0IFwiQC9zdHlsZXMvbWl4aW4uc2Nzc1wiO1xuICAgICAgICBgXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiBcIjAuMC4wLjBcIixcbiAgICBwb3J0OiA4MDg5LFxuICAgIG9wZW46IHRydWUsIC8vIFx1OEZEMFx1ODg0Q1x1NjYyRlx1NTQyNlx1ODFFQVx1NTJBOFx1NjI1M1x1NUYwMFx1NkQ0Rlx1ODlDOFx1NTY2OFxuICAgIHByb3h5OiB7XG4gICAgICAnL2Rldi1hcGkvbHUnOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xNDAuMTQzLjE1NC4yMTY6OTA1MScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+XG4gICAgICAgICAgcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoXCJeL2Rldi1hcGlcIiksIFwiXCIpLCAvLyBcdTY2RkZcdTYzNjIgL2Rldi1hcGkgXHU0RTNBIHRhcmdldCBcdTYzQTVcdTUzRTNcdTU3MzBcdTU3NDBcbiAgICAgIH0sXG4gICAgICAnL2Rldi1hcGlubyc6IHtcbiAgICAgICAgdGFyZ2V0OiBgaHR0cDovLzE0MC4yMDcuMTY2LjIxMDo5MDMwYCxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT5cbiAgICAgICAgICBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChcIl4vZGV2LWFwaW5vXCIpLCBcIlwiKSwgLy8gXHU2NkZGXHU2MzYyIC9kZXYtYXBpIFx1NEUzQSB0YXJnZXQgXHU2M0E1XHU1M0UzXHU1NzMwXHU1NzQwXG4gICAgICB9LFxuICAgICAgJy9kZXYtYXBpJzoge1xuICAgICAgICAvLyB0YXJnZXQ6IFwiaHR0cDovLzEyNy4wLjAuMTo0NTIzL20xLzI4ODU4MjItMC1kZWZhdWx0XCIsXG4gICAgICAgIC8vIHRhcmdldDogJ2h0dHA6Ly8xNDAuMjA3LjE2Ni4yMTA6OTAzMCcsXG4gICAgICAgIC8vdGFyZ2V0OiAnaHR0cDovLzE0MC4yMDcuMTY2LjIxMDo5MDMwL2dhdGV3YXknLFxuICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9jbG91ZC5zaW5vZ25zcy5jb20vZ2F0ZXdheScsXG4gICAgICAgIC8vdGFyZ2V0OiAnaHR0cDovLzE0MC4yMDcuMTY2LjIxMDo5MDMwL2dhdGV3YXkvZmFybScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+XG4gICAgICAgICAgcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoXCJeL2Rldi1hcGlcIiksIFwiXCIpLCAvLyBcdTY2RkZcdTYzNjIgL2Rldi1hcGkgXHU0RTNBIHRhcmdldCBcdTYzQTVcdTUzRTNcdTU3MzBcdTU3NDBcbiAgICAgIH0sXG5cbiAgICAgIC8vIFx1ODFFQVx1NUI5QVx1NEU0OVx1NTczMFx1NTZGRVx1NjcwRFx1NTJBMVx1NEVFM1x1NzQwNlxuICAgICAgJy9fQU1hcFNlcnZpY2UvdjQvbWFwL3N0eWxlcyc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly93ZWJhcGkuYW1hcC5jb20vdjQvbWFwL3N0eWxlcycsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IGAke3BhdGgucmVwbGFjZSgvXlxcL19BTWFwU2VydmljZVxcL3Y0XFwvbWFwXFwvc3R5bGVzLywgJy92NC9tYXAvc3R5bGVzJyl9P2pzY29kZT0zY2I2M2VkNTljNmU0NTNhZTdhY2IwMzFmMDk2ODY4NmBcbiAgICAgIH0sXG4gICAgICAvLyBcdTZENzdcdTU5MTZcdTU3MzBcdTU2RkVcdTY3MERcdTUyQTFcdTRFRTNcdTc0MDZcbiAgICAgICcvX0FNYXBTZXJ2aWNlL3YzL3ZlY3Rvcm1hcCc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9mbWFwMDEuYW1hcC5jb20vdjMvdmVjdG9ybWFwJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gYCR7cGF0aC5yZXBsYWNlKC9eXFwvX0FNYXBTZXJ2aWNlXFwvdjNcXC92ZWN0b3JtYXAvLCAnL3YzL3ZlY3Rvcm1hcCcpfT9qc2NvZGU9M2NiNjNlZDU5YzZlNDUzYWU3YWNiMDMxZjA5Njg2ODZgXG4gICAgICB9LFxuICAgICAgLy8gV2ViXHU2NzBEXHU1MkExQVBJXHU0RUUzXHU3NDA2XG4gICAgICAnL19BTWFwU2VydmljZSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9yZXN0YXBpLmFtYXAuY29tJywgIC8vIFx1NUI5RVx1OTY0NVx1NzY4NFx1NjcwRFx1NTJBMVx1N0FFRlx1NTczMFx1NTc0MFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsICAvLyBcdTY1MzlcdTUzRDhcdThCRjdcdTZDNDJcdTZFOTBcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IGAke3BhdGgucmVwbGFjZSgvXlxcL19BTWFwU2VydmljZVxcLy8sICcvJyl9P2pzY29kZT0zY2I2M2VkNTljNmU0NTNhZTdhY2IwMzFmMDk2ODY4NmAgIC8vIFx1OTFDRFx1NTE5OVx1OEJGN1x1NkM0Mlx1OERFRlx1NUY4NFxuICAgICAgfSxcbiAgICAgIC8vXHU3NjdFXHU1RUE2XHU1NzMwXHU1NkZFXG4gICAgICAnL2FwaS1iYWlkdSc6IHtcbiAgICAgICAgdGFyZ2V0OiBiYWlkdVVybCxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gYCR7cGF0aC5yZXBsYWNlKC9eXFwvYXBpLWJhaWR1LywgJycpfWBcbiAgICAgIH0sXG4gICAgICAnL25vLWdhdGV3YXknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHBzOi8vY2xvdWQuc2lub2duc3MuY29tJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gYCR7cGF0aC5yZXBsYWNlKC9eXFwvbm8tZ2F0ZXdheS8sICcnKX1gXG4gICAgICB9XG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNVLFNBQVMsb0JBQW9CO0FBQ25XLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFJakIsU0FBUyw0QkFBNEI7QUFFckMsT0FBTyxtQkFBbUI7QUFFMUIsSUFBTSxXQUFXO0FBSWpCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUFDLElBQUk7QUFB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
