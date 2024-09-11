// vite.config.ts
import { defineConfig } from "file:///D:/corporationDemo/ops_farm/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/corporationDemo/ops_farm/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import { createSvgIconsPlugin } from "file:///D:/corporationDemo/ops_farm/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import topLevelAwait from "file:///D:/corporationDemo/ops_farm/node_modules/vite-plugin-top-level-await/exports/import.mjs";
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
        target: "http://140.207.166.210:9030/gateway",
        //target: 'https://cloud.sinognss.com/gateway',
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjb3Jwb3JhdGlvbkRlbW9cXFxcb3BzX2Zhcm1cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGNvcnBvcmF0aW9uRGVtb1xcXFxvcHNfZmFybVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovY29ycG9yYXRpb25EZW1vL29wc19mYXJtL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcblxyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG4vLyBpbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1zdmctaWNvbnNcIjtcclxuLy8gaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IHRvcExldmVsQXdhaXQgZnJvbSAndml0ZS1wbHVnaW4tdG9wLWxldmVsLWF3YWl0J1xyXG5cclxuY29uc3QgYmFpZHVVcmwgPSBgaHR0cHM6Ly9hcGkubWFwLmJhaWR1LmNvbWA7XHJcbmNvbnN0IG5vZ2F0ZXdheSA9IGBodHRwczovL2Nsb3VkLnNpbm9nbnNzLmNvbS9nYXRld2F5YDtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgYmFzZTogXCIuL1wiLFxyXG4gIHBsdWdpbnM6IFt2dWUoKSxcclxuICAvLyBBdXRvSW1wb3J0KHtcclxuICAvLyBBdXRvIGltcG9ydCBmdW5jdGlvbnMgZnJvbSBWdWUsIGUuZy4gcmVmLCByZWFjdGl2ZSwgdG9SZWYuLi5cclxuICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgVnVlIFx1NzZGOFx1NTE3M1x1NTFGRFx1NjU3MFx1RkYwQ1x1NTk4Mlx1RkYxQXJlZiwgcmVhY3RpdmUsIHRvUmVmIFx1N0I0OVxyXG4gIC8vIGltcG9ydHM6IFtcInZ1ZVwiXSxcclxuXHJcbiAgLy8gQXV0byBpbXBvcnQgZnVuY3Rpb25zIGZyb20gRWxlbWVudCBQbHVzLCBlLmcuIEVsTWVzc2FnZSwgRWxNZXNzYWdlQm94Li4uICh3aXRoIHN0eWxlKVxyXG4gIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBFbGVtZW50IFBsdXMgXHU3NkY4XHU1MTczXHU1MUZEXHU2NTcwXHVGRjBDXHU1OTgyXHVGRjFBRWxNZXNzYWdlLCBFbE1lc3NhZ2VCb3guLi4gKFx1NUUyNlx1NjgzN1x1NUYwRilcclxuICAvLyByZXNvbHZlcnM6IFtcclxuICAvLyBFbGVtZW50UGx1c1Jlc29sdmVyKClcclxuICAvLyBdLFxyXG5cclxuICAvLyB9KSxcclxuICAvLyBDb21wb25lbnRzKHtcclxuICAvLyAgIGRpcnM6IFsnc3JjL2NvbXBvbmVudHMnXSwgLy8gXHU2MzA5XHU5NzAwXHU1MkEwXHU4RjdEXHU3Njg0XHU2NTg3XHU0RUY2XHU1OTM5XHJcbiAgLy8gfSksXHJcbiAgY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xyXG4gICAgLy8gXHU2MzA3XHU1QjlBXHU5NzAwXHU4OTgxXHU3RjEzXHU1QjU4XHU3Njg0XHU1NkZFXHU2ODA3XHU2NTg3XHU0RUY2XHU1OTM5XHJcbiAgICBpY29uRGlyczogW3BhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBcInNyYy9hc3NldHMvaWNvbnNcIildLFxyXG4gICAgLy8gXHU2MzA3XHU1QjlBc3ltYm9sSWRcdTY4M0NcdTVGMEZcclxuICAgIHN5bWJvbElkOiBcImljb24tW2Rpcl0tW25hbWVdXCIsXHJcbiAgfSksXHJcbiAgdG9wTGV2ZWxBd2FpdCh7XHJcbiAgICAvLyBUaGUgZXhwb3J0IG5hbWUgb2YgdG9wLWxldmVsIGF3YWl0IHByb21pc2UgZm9yIGVhY2ggY2h1bmsgbW9kdWxlXHJcbiAgICBwcm9taXNlRXhwb3J0TmFtZTogJ19fdGxhJyxcclxuICAgIC8vIFRoZSBmdW5jdGlvbiB0byBnZW5lcmF0ZSBpbXBvcnQgbmFtZXMgb2YgdG9wLWxldmVsIGF3YWl0IHByb21pc2UgaW4gZWFjaCBjaHVuayBtb2R1bGVcclxuICAgIHByb21pc2VJbXBvcnROYW1lOiBpID0+IGBfX3RsYV8ke2l9YFxyXG4gIH0pXHJcblxyXG5cclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ3NyYycpXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY3NzOiB7XHJcbiAgICAvLyBjc3NcdTk4ODRcdTU5MDRcdTc0MDZcdTU2NjhcclxuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgc2Nzczoge1xyXG4gICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgXHJcbiAgICAgICAgICBAaW1wb3J0IFwiQC9zdHlsZXMvdmFyaWFibGVzLnNjc3NcIjtcclxuICAgICAgICAgIEBpbXBvcnQgXCJAL3N0eWxlcy9taXhpbi5zY3NzXCI7XHJcbiAgICAgICAgYFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxyXG4gICAgcG9ydDogODA4OSxcclxuICAgIG9wZW46IHRydWUsIC8vIFx1OEZEMFx1ODg0Q1x1NjYyRlx1NTQyNlx1ODFFQVx1NTJBOFx1NjI1M1x1NUYwMFx1NkQ0Rlx1ODlDOFx1NTY2OFxyXG4gICAgcHJveHk6IHtcclxuICAgICAgJy9kZXYtYXBpL2x1Jzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xNDAuMTQzLjE1NC4yMTY6OTA1MScsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PlxyXG4gICAgICAgICAgcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoXCJeL2Rldi1hcGlcIiksIFwiXCIpLCAvLyBcdTY2RkZcdTYzNjIgL2Rldi1hcGkgXHU0RTNBIHRhcmdldCBcdTYzQTVcdTUzRTNcdTU3MzBcdTU3NDBcclxuICAgICAgfSxcclxuICAgICAgJy9kZXYtYXBpbm8nOiB7XHJcbiAgICAgICAgdGFyZ2V0OiBgaHR0cDovLzE0MC4yMDcuMTY2LjIxMDo5MDMwYCxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+XHJcbiAgICAgICAgICBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChcIl4vZGV2LWFwaW5vXCIpLCBcIlwiKSwgLy8gXHU2NkZGXHU2MzYyIC9kZXYtYXBpIFx1NEUzQSB0YXJnZXQgXHU2M0E1XHU1M0UzXHU1NzMwXHU1NzQwXHJcbiAgICAgIH0sXHJcbiAgICAgICcvZGV2LWFwaSc6IHtcclxuICAgICAgICAvLyB0YXJnZXQ6IFwiaHR0cDovLzEyNy4wLjAuMTo0NTIzL20xLzI4ODU4MjItMC1kZWZhdWx0XCIsXHJcbiAgICAgICAgLy8gdGFyZ2V0OiAnaHR0cDovLzE0MC4yMDcuMTY2LjIxMDo5MDMwJyxcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTQwLjIwNy4xNjYuMjEwOjkwMzAvZ2F0ZXdheScsXHJcbiAgICAgICAgLy90YXJnZXQ6ICdodHRwczovL2Nsb3VkLnNpbm9nbnNzLmNvbS9nYXRld2F5JyxcclxuICAgICAgICAvL3RhcmdldDogJ2h0dHA6Ly8xNDAuMjA3LjE2Ni4yMTA6OTAzMC9nYXRld2F5L2Zhcm0nLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT5cclxuICAgICAgICAgIHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKFwiXi9kZXYtYXBpXCIpLCBcIlwiKSwgLy8gXHU2NkZGXHU2MzYyIC9kZXYtYXBpIFx1NEUzQSB0YXJnZXQgXHU2M0E1XHU1M0UzXHU1NzMwXHU1NzQwXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyBcdTgxRUFcdTVCOUFcdTRFNDlcdTU3MzBcdTU2RkVcdTY3MERcdTUyQTFcdTRFRTNcdTc0MDZcclxuICAgICAgJy9fQU1hcFNlcnZpY2UvdjQvbWFwL3N0eWxlcyc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwczovL3dlYmFwaS5hbWFwLmNvbS92NC9tYXAvc3R5bGVzJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IGAke3BhdGgucmVwbGFjZSgvXlxcL19BTWFwU2VydmljZVxcL3Y0XFwvbWFwXFwvc3R5bGVzLywgJy92NC9tYXAvc3R5bGVzJyl9P2pzY29kZT0zY2I2M2VkNTljNmU0NTNhZTdhY2IwMzFmMDk2ODY4NmBcclxuICAgICAgfSxcclxuICAgICAgLy8gXHU2RDc3XHU1OTE2XHU1NzMwXHU1NkZFXHU2NzBEXHU1MkExXHU0RUUzXHU3NDA2XHJcbiAgICAgICcvX0FNYXBTZXJ2aWNlL3YzL3ZlY3Rvcm1hcCc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwczovL2ZtYXAwMS5hbWFwLmNvbS92My92ZWN0b3JtYXAnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gYCR7cGF0aC5yZXBsYWNlKC9eXFwvX0FNYXBTZXJ2aWNlXFwvdjNcXC92ZWN0b3JtYXAvLCAnL3YzL3ZlY3Rvcm1hcCcpfT9qc2NvZGU9M2NiNjNlZDU5YzZlNDUzYWU3YWNiMDMxZjA5Njg2ODZgXHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIFdlYlx1NjcwRFx1NTJBMUFQSVx1NEVFM1x1NzQwNlxyXG4gICAgICAnL19BTWFwU2VydmljZSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwczovL3Jlc3RhcGkuYW1hcC5jb20nLCAgLy8gXHU1QjlFXHU5NjQ1XHU3Njg0XHU2NzBEXHU1MkExXHU3QUVGXHU1NzMwXHU1NzQwXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLCAgLy8gXHU2NTM5XHU1M0Q4XHU4QkY3XHU2QzQyXHU2RTkwXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IGAke3BhdGgucmVwbGFjZSgvXlxcL19BTWFwU2VydmljZVxcLy8sICcvJyl9P2pzY29kZT0zY2I2M2VkNTljNmU0NTNhZTdhY2IwMzFmMDk2ODY4NmAgIC8vIFx1OTFDRFx1NTE5OVx1OEJGN1x1NkM0Mlx1OERFRlx1NUY4NFxyXG4gICAgICB9LFxyXG4gICAgICAvL1x1NzY3RVx1NUVBNlx1NTczMFx1NTZGRVxyXG4gICAgICAnL2FwaS1iYWlkdSc6IHtcclxuICAgICAgICB0YXJnZXQ6IGJhaWR1VXJsLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gYCR7cGF0aC5yZXBsYWNlKC9eXFwvYXBpLWJhaWR1LywgJycpfWBcclxuICAgICAgfSxcclxuICAgICAgJy9uby1nYXRld2F5Jzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHBzOi8vY2xvdWQuc2lub2duc3MuY29tJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IGAke3BhdGgucmVwbGFjZSgvXlxcL25vLWdhdGV3YXkvLCAnJyl9YFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVEsU0FBUyxvQkFBb0I7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
