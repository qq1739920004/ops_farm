// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/corporationDemo/ops_farm/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/corporationDemo/ops_farm/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import { createSvgIconsPlugin } from "file:///D:/corporationDemo/ops_farm/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import Components from "file:///D:/corporationDemo/ops_farm/node_modules/unplugin-vue-components/dist/vite.mjs";
import topLevelAwait from "file:///D:/corporationDemo/ops_farm/node_modules/vite-plugin-top-level-await/exports/import.mjs";
var baiduUrl = `https://api.map.baidu.com`;
var vite_config_default = ({ mode }) => defineConfig({
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
    Components({
      dirs: ["src/components"]
      // 按需加载的文件夹
    }),
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
        api: "modern-compiler",
        additionalData: `
          @use "@/styles/variables.scss" as *;
          @use "@/styles/mixin.scss" as *;
        `
      }
    }
  },
  build: {
    outDir: `dist-${loadEnv(mode, process.cwd()).VITE_ENV}`
    //指定打包输出路径
  },
  server: {
    host: "0.0.0.0",
    port: 8089,
    open: true,
    // 运行是否自动打开浏览器
    proxy: {
      // '/dev-api/lu': {
      //   target: 'http://140.143.154.216:9051',
      //   changeOrigin: true,
      //   rewrite: (path) =>
      //     path.replace(new RegExp("^/dev-api"), ""), // 替换 /dev-api 为 target 接口地址
      // },
      "/dev-apino": {
        target: `http://140.207.166.210:9030`,
        changeOrigin: true,
        rewrite: (path2) => path2.replace(new RegExp("^/dev-apino"), "")
        // 替换 /dev-api 为 target 接口地址
      },
      "/dev-api": {
        // target: "http://127.0.0.1:4523/m1/2885822-0-default",
        // target: 'http://140.207.166.210:9030',
        target: "http://140.207.166.210:9030/gateway",
        // target:'https://cloud.comnavtech.com/gateway',
        // target: 'http://192.168.2.136/gateway'
        //target: 'https://cloud.sinognss.com/gateway',
        // target: 'https://ads.changfanz.net/gateway',
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjb3Jwb3JhdGlvbkRlbW9cXFxcb3BzX2Zhcm1cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGNvcnBvcmF0aW9uRGVtb1xcXFxvcHNfZmFybVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovY29ycG9yYXRpb25EZW1vL29wc19mYXJtL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcblxyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG4vLyBpbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1zdmctaWNvbnNcIjtcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IHRvcExldmVsQXdhaXQgZnJvbSAndml0ZS1wbHVnaW4tdG9wLWxldmVsLWF3YWl0J1xyXG5cclxuY29uc3QgYmFpZHVVcmwgPSBgaHR0cHM6Ly9hcGkubWFwLmJhaWR1LmNvbWA7XHJcbmNvbnN0IG5vZ2F0ZXdheSA9IGBodHRwczovL2Nsb3VkLnNpbm9nbnNzLmNvbS9nYXRld2F5YDtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0ICh7IG1vZGUgfSkgPT4gZGVmaW5lQ29uZmlnKHtcclxuICBiYXNlOiBcIi4vXCIsXHJcbiAgcGx1Z2luczogW3Z1ZSgpLFxyXG4gIC8vIEF1dG9JbXBvcnQoe1xyXG4gIC8vIEF1dG8gaW1wb3J0IGZ1bmN0aW9ucyBmcm9tIFZ1ZSwgZS5nLiByZWYsIHJlYWN0aXZlLCB0b1JlZi4uLlxyXG4gIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBWdWUgXHU3NkY4XHU1MTczXHU1MUZEXHU2NTcwXHVGRjBDXHU1OTgyXHVGRjFBcmVmLCByZWFjdGl2ZSwgdG9SZWYgXHU3QjQ5XHJcbiAgLy8gaW1wb3J0czogW1widnVlXCJdLFxyXG5cclxuICAvLyBBdXRvIGltcG9ydCBmdW5jdGlvbnMgZnJvbSBFbGVtZW50IFBsdXMsIGUuZy4gRWxNZXNzYWdlLCBFbE1lc3NhZ2VCb3guLi4gKHdpdGggc3R5bGUpXHJcbiAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IEVsZW1lbnQgUGx1cyBcdTc2RjhcdTUxNzNcdTUxRkRcdTY1NzBcdUZGMENcdTU5ODJcdUZGMUFFbE1lc3NhZ2UsIEVsTWVzc2FnZUJveC4uLiAoXHU1RTI2XHU2ODM3XHU1RjBGKVxyXG4gIC8vIHJlc29sdmVyczogW1xyXG4gIC8vIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKVxyXG4gIC8vIF0sXHJcblxyXG4gIC8vIH0pLFxyXG4gIENvbXBvbmVudHMoe1xyXG4gICAgZGlyczogWydzcmMvY29tcG9uZW50cyddLCAvLyBcdTYzMDlcdTk3MDBcdTUyQTBcdThGN0RcdTc2ODRcdTY1ODdcdTRFRjZcdTU5MzlcclxuICB9KSxcclxuICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XHJcbiAgICAvLyBcdTYzMDdcdTVCOUFcdTk3MDBcdTg5ODFcdTdGMTNcdTVCNThcdTc2ODRcdTU2RkVcdTY4MDdcdTY1ODdcdTRFRjZcdTU5MzlcclxuICAgIGljb25EaXJzOiBbcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIFwic3JjL2Fzc2V0cy9pY29uc1wiKV0sXHJcbiAgICAvLyBcdTYzMDdcdTVCOUFzeW1ib2xJZFx1NjgzQ1x1NUYwRlxyXG4gICAgc3ltYm9sSWQ6IFwiaWNvbi1bZGlyXS1bbmFtZV1cIixcclxuICB9KSxcclxuICB0b3BMZXZlbEF3YWl0KHtcclxuICAgIC8vIFRoZSBleHBvcnQgbmFtZSBvZiB0b3AtbGV2ZWwgYXdhaXQgcHJvbWlzZSBmb3IgZWFjaCBjaHVuayBtb2R1bGVcclxuICAgIHByb21pc2VFeHBvcnROYW1lOiAnX190bGEnLFxyXG4gICAgLy8gVGhlIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGltcG9ydCBuYW1lcyBvZiB0b3AtbGV2ZWwgYXdhaXQgcHJvbWlzZSBpbiBlYWNoIGNodW5rIG1vZHVsZVxyXG4gICAgcHJvbWlzZUltcG9ydE5hbWU6IGkgPT4gYF9fdGxhXyR7aX1gXHJcbiAgfSlcclxuXHJcblxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnc3JjJylcclxuICAgIH0sXHJcbiAgfSxcclxuICBjc3M6IHtcclxuICAgIC8vIGNzc1x1OTg4NFx1NTkwNFx1NzQwNlx1NTY2OFxyXG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICBzY3NzOiB7XHJcbiAgICAgICAgYXBpOiBcIm1vZGVybi1jb21waWxlclwiLFxyXG4gICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgXHJcbiAgICAgICAgICBAdXNlIFwiQC9zdHlsZXMvdmFyaWFibGVzLnNjc3NcIiBhcyAqO1xyXG4gICAgICAgICAgQHVzZSBcIkAvc3R5bGVzL21peGluLnNjc3NcIiBhcyAqO1xyXG4gICAgICAgIGBcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIG91dERpcjogYGRpc3QtJHtsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpLlZJVEVfRU5WfWAsIC8vXHU2MzA3XHU1QjlBXHU2MjUzXHU1MzA1XHU4RjkzXHU1MUZBXHU4REVGXHU1Rjg0XHJcblxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiBcIjAuMC4wLjBcIixcclxuICAgIHBvcnQ6IDgwODksXHJcbiAgICBvcGVuOiB0cnVlLCAvLyBcdThGRDBcdTg4NENcdTY2MkZcdTU0MjZcdTgxRUFcdTUyQThcdTYyNTNcdTVGMDBcdTZENEZcdTg5QzhcdTU2NjhcclxuICAgIHByb3h5OiB7XHJcbiAgICAgIC8vICcvZGV2LWFwaS9sdSc6IHtcclxuICAgICAgLy8gICB0YXJnZXQ6ICdodHRwOi8vMTQwLjE0My4xNTQuMjE2OjkwNTEnLFxyXG4gICAgICAvLyAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgLy8gICByZXdyaXRlOiAocGF0aCkgPT5cclxuICAgICAgLy8gICAgIHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKFwiXi9kZXYtYXBpXCIpLCBcIlwiKSwgLy8gXHU2NkZGXHU2MzYyIC9kZXYtYXBpIFx1NEUzQSB0YXJnZXQgXHU2M0E1XHU1M0UzXHU1NzMwXHU1NzQwXHJcbiAgICAgIC8vIH0sXHJcbiAgICAgICcvZGV2LWFwaW5vJzoge1xyXG4gICAgICAgIHRhcmdldDogYGh0dHA6Ly8xNDAuMjA3LjE2Ni4yMTA6OTAzMGAsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PlxyXG4gICAgICAgICAgcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoXCJeL2Rldi1hcGlub1wiKSwgXCJcIiksIC8vIFx1NjZGRlx1NjM2MiAvZGV2LWFwaSBcdTRFM0EgdGFyZ2V0IFx1NjNBNVx1NTNFM1x1NTczMFx1NTc0MFxyXG4gICAgICB9LFxyXG4gICAgICAnL2Rldi1hcGknOiB7XHJcbiAgICAgICAgLy8gdGFyZ2V0OiBcImh0dHA6Ly8xMjcuMC4wLjE6NDUyMy9tMS8yODg1ODIyLTAtZGVmYXVsdFwiLFxyXG4gICAgICAgIC8vIHRhcmdldDogJ2h0dHA6Ly8xNDAuMjA3LjE2Ni4yMTA6OTAzMCcsXHJcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTQwLjIwNy4xNjYuMjEwOjkwMzAvZ2F0ZXdheScsXHJcbiAgICAgICAvLyB0YXJnZXQ6J2h0dHBzOi8vY2xvdWQuY29tbmF2dGVjaC5jb20vZ2F0ZXdheScsXHJcbiAgICAgICAgLy8gdGFyZ2V0OiAnaHR0cDovLzE5Mi4xNjguMi4xMzYvZ2F0ZXdheSdcclxuICAgICAgICAgIC8vdGFyZ2V0OiAnaHR0cHM6Ly9jbG91ZC5zaW5vZ25zcy5jb20vZ2F0ZXdheScsXHJcbiAgICAgICAgLy8gdGFyZ2V0OiAnaHR0cHM6Ly9hZHMuY2hhbmdmYW56Lm5ldC9nYXRld2F5JyxcclxuICAgICAgICAvL3RhcmdldDogJ2h0dHA6Ly8xNDAuMjA3LjE2Ni4yMTA6OTAzMC9nYXRld2F5L2Zhcm0nLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT5cclxuICAgICAgICAgIHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKFwiXi9kZXYtYXBpXCIpLCBcIlwiKSwgLy8gXHU2NkZGXHU2MzYyIC9kZXYtYXBpIFx1NEUzQSB0YXJnZXQgXHU2M0E1XHU1M0UzXHU1NzMwXHU1NzQwXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyBcdTgxRUFcdTVCOUFcdTRFNDlcdTU3MzBcdTU2RkVcdTY3MERcdTUyQTFcdTRFRTNcdTc0MDZcclxuICAgICAgJy9fQU1hcFNlcnZpY2UvdjQvbWFwL3N0eWxlcyc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwczovL3dlYmFwaS5hbWFwLmNvbS92NC9tYXAvc3R5bGVzJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IGAke3BhdGgucmVwbGFjZSgvXlxcL19BTWFwU2VydmljZVxcL3Y0XFwvbWFwXFwvc3R5bGVzLywgJy92NC9tYXAvc3R5bGVzJyl9P2pzY29kZT0zY2I2M2VkNTljNmU0NTNhZTdhY2IwMzFmMDk2ODY4NmBcclxuICAgICAgfSxcclxuICAgICAgLy8gXHU2RDc3XHU1OTE2XHU1NzMwXHU1NkZFXHU2NzBEXHU1MkExXHU0RUUzXHU3NDA2XHJcbiAgICAgICcvX0FNYXBTZXJ2aWNlL3YzL3ZlY3Rvcm1hcCc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwczovL2ZtYXAwMS5hbWFwLmNvbS92My92ZWN0b3JtYXAnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gYCR7cGF0aC5yZXBsYWNlKC9eXFwvX0FNYXBTZXJ2aWNlXFwvdjNcXC92ZWN0b3JtYXAvLCAnL3YzL3ZlY3Rvcm1hcCcpfT9qc2NvZGU9M2NiNjNlZDU5YzZlNDUzYWU3YWNiMDMxZjA5Njg2ODZgXHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIFdlYlx1NjcwRFx1NTJBMUFQSVx1NEVFM1x1NzQwNlxyXG4gICAgICAnL19BTWFwU2VydmljZSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwczovL3Jlc3RhcGkuYW1hcC5jb20nLCAgLy8gXHU1QjlFXHU5NjQ1XHU3Njg0XHU2NzBEXHU1MkExXHU3QUVGXHU1NzMwXHU1NzQwXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLCAgLy8gXHU2NTM5XHU1M0Q4XHU4QkY3XHU2QzQyXHU2RTkwXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IGAke3BhdGgucmVwbGFjZSgvXlxcL19BTWFwU2VydmljZVxcLy8sICcvJyl9P2pzY29kZT0zY2I2M2VkNTljNmU0NTNhZTdhY2IwMzFmMDk2ODY4NmAgIC8vIFx1OTFDRFx1NTE5OVx1OEJGN1x1NkM0Mlx1OERFRlx1NUY4NFxyXG4gICAgICB9LFxyXG4gICAgICAvL1x1NzY3RVx1NUVBNlx1NTczMFx1NTZGRVxyXG4gICAgICAnL2FwaS1iYWlkdSc6IHtcclxuICAgICAgICB0YXJnZXQ6IGJhaWR1VXJsLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gYCR7cGF0aC5yZXBsYWNlKC9eXFwvYXBpLWJhaWR1LywgJycpfWBcclxuICAgICAgfSxcclxuICAgICAgJy9uby1nYXRld2F5Jzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHBzOi8vY2xvdWQuc2lub2duc3MuY29tJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IGAke3BhdGgucmVwbGFjZSgvXlxcL25vLWdhdGV3YXkvLCAnJyl9YFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVEsU0FBUyxjQUFjLGVBQWU7QUFDL1MsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUlqQixTQUFTLDRCQUE0QjtBQUNyQyxPQUFPLGdCQUFnQjtBQUN2QixPQUFPLG1CQUFtQjtBQUUxQixJQUFNLFdBQVc7QUFJakIsSUFBTyxzQkFBUSxDQUFDLEVBQUUsS0FBSyxNQUFNLGFBQWE7QUFBQSxFQUN4QyxNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFBQyxJQUFJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQWFkLFdBQVc7QUFBQSxNQUNULE1BQU0sQ0FBQyxnQkFBZ0I7QUFBQTtBQUFBLElBQ3pCLENBQUM7QUFBQSxJQUNELHFCQUFxQjtBQUFBO0FBQUEsTUFFbkIsVUFBVSxDQUFDLEtBQUssUUFBUSxRQUFRLElBQUksR0FBRyxrQkFBa0IsQ0FBQztBQUFBO0FBQUEsTUFFMUQsVUFBVTtBQUFBLElBQ1osQ0FBQztBQUFBLElBQ0QsY0FBYztBQUFBO0FBQUEsTUFFWixtQkFBbUI7QUFBQTtBQUFBLE1BRW5CLG1CQUFtQixPQUFLLFNBQVMsQ0FBQztBQUFBLElBQ3BDLENBQUM7QUFBQSxFQUdEO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxRQUFRLElBQUksR0FBRyxLQUFLO0FBQUEsSUFDeEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxLQUFLO0FBQUE7QUFBQSxJQUVILHFCQUFxQjtBQUFBLE1BQ25CLE1BQU07QUFBQSxRQUNKLEtBQUs7QUFBQSxRQUNMLGdCQUFnQjtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BSWxCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVEsUUFBUSxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUMsRUFBRSxRQUFRO0FBQUE7QUFBQSxFQUV2RDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsSUFDTixPQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFPTCxjQUFjO0FBQUEsUUFDWixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUNBLFVBQ1JBLE1BQUssUUFBUSxJQUFJLE9BQU8sYUFBYSxHQUFHLEVBQUU7QUFBQTtBQUFBLE1BQzlDO0FBQUEsTUFDQSxZQUFZO0FBQUE7QUFBQTtBQUFBLFFBR1IsUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQU1WLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQ0EsVUFDUkEsTUFBSyxRQUFRLElBQUksT0FBTyxXQUFXLEdBQUcsRUFBRTtBQUFBO0FBQUEsTUFDNUM7QUFBQTtBQUFBLE1BR0EsK0JBQStCO0FBQUEsUUFDN0IsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDQSxVQUFTLEdBQUdBLE1BQUssUUFBUSxvQ0FBb0MsZ0JBQWdCLENBQUM7QUFBQSxNQUMxRjtBQUFBO0FBQUEsTUFFQSw4QkFBOEI7QUFBQSxRQUM1QixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUNBLFVBQVMsR0FBR0EsTUFBSyxRQUFRLGtDQUFrQyxlQUFlLENBQUM7QUFBQSxNQUN2RjtBQUFBO0FBQUEsTUFFQSxpQkFBaUI7QUFBQSxRQUNmLFFBQVE7QUFBQTtBQUFBLFFBQ1IsY0FBYztBQUFBO0FBQUEsUUFDZCxTQUFTLENBQUNBLFVBQVMsR0FBR0EsTUFBSyxRQUFRLHFCQUFxQixHQUFHLENBQUM7QUFBQTtBQUFBLE1BQzlEO0FBQUE7QUFBQSxNQUVBLGNBQWM7QUFBQSxRQUNaLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQ0EsVUFBUyxHQUFHQSxNQUFLLFFBQVEsZ0JBQWdCLEVBQUUsQ0FBQztBQUFBLE1BQ3hEO0FBQUEsTUFDQSxlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUNBLFVBQVMsR0FBR0EsTUFBSyxRQUFRLGlCQUFpQixFQUFFLENBQUM7QUFBQSxNQUN6RDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
