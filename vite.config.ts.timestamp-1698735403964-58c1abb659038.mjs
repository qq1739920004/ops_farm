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
  server: {
    host: "127.0.0.1",
    port: 8088,
    open: true,
    // 运行是否自动打开浏览器
    proxy: {
      "/dev-api/lu": {
        target: "http://140.143.154.216:9051",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(new RegExp("^/dev-api"), "")
        // 替换 /dev-api 为 target 接口地址
      },
      "/dev-api": {
        // target: "http://127.0.0.1:4523/m1/2885822-0-default",
        // target: 'http://140.207.166.210:9030',
        target: "http://140.207.166.210:9030/gateway",
        // target: 'http://140.207.166.210:9030/gateway/farm',
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
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjb3Jwb3JhdGlvbkRlbW9cXFxcb3BzX2Zhcm1cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGNvcnBvcmF0aW9uRGVtb1xcXFxvcHNfZmFybVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovY29ycG9yYXRpb25EZW1vL29wc19mYXJtL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcblxyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG4vLyBpbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1zdmctaWNvbnNcIjtcclxuLy8gaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IHRvcExldmVsQXdhaXQgZnJvbSAndml0ZS1wbHVnaW4tdG9wLWxldmVsLWF3YWl0J1xyXG5cclxuY29uc3QgYmFpZHVVcmwgPSBgaHR0cHM6Ly9hcGkubWFwLmJhaWR1LmNvbWA7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGJhc2U6IFwiLi9cIixcclxuICBwbHVnaW5zOiBbdnVlKCksXHJcbiAgLy8gQXV0b0ltcG9ydCh7XHJcbiAgLy8gQXV0byBpbXBvcnQgZnVuY3Rpb25zIGZyb20gVnVlLCBlLmcuIHJlZiwgcmVhY3RpdmUsIHRvUmVmLi4uXHJcbiAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IFZ1ZSBcdTc2RjhcdTUxNzNcdTUxRkRcdTY1NzBcdUZGMENcdTU5ODJcdUZGMUFyZWYsIHJlYWN0aXZlLCB0b1JlZiBcdTdCNDlcclxuICAvLyBpbXBvcnRzOiBbXCJ2dWVcIl0sXHJcblxyXG4gIC8vIEF1dG8gaW1wb3J0IGZ1bmN0aW9ucyBmcm9tIEVsZW1lbnQgUGx1cywgZS5nLiBFbE1lc3NhZ2UsIEVsTWVzc2FnZUJveC4uLiAod2l0aCBzdHlsZSlcclxuICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgRWxlbWVudCBQbHVzIFx1NzZGOFx1NTE3M1x1NTFGRFx1NjU3MFx1RkYwQ1x1NTk4Mlx1RkYxQUVsTWVzc2FnZSwgRWxNZXNzYWdlQm94Li4uIChcdTVFMjZcdTY4MzdcdTVGMEYpXHJcbiAgLy8gcmVzb2x2ZXJzOiBbXHJcbiAgLy8gRWxlbWVudFBsdXNSZXNvbHZlcigpXHJcbiAgLy8gXSxcclxuXHJcbiAgLy8gfSksXHJcbiAgLy8gQ29tcG9uZW50cyh7XHJcbiAgLy8gICBkaXJzOiBbJ3NyYy9jb21wb25lbnRzJ10sIC8vIFx1NjMwOVx1OTcwMFx1NTJBMFx1OEY3RFx1NzY4NFx1NjU4N1x1NEVGNlx1NTkzOVxyXG4gIC8vIH0pLFxyXG4gIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcclxuICAgIC8vIFx1NjMwN1x1NUI5QVx1OTcwMFx1ODk4MVx1N0YxM1x1NUI1OFx1NzY4NFx1NTZGRVx1NjgwN1x1NjU4N1x1NEVGNlx1NTkzOVxyXG4gICAgaWNvbkRpcnM6IFtwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgXCJzcmMvYXNzZXRzL2ljb25zXCIpXSxcclxuICAgIC8vIFx1NjMwN1x1NUI5QXN5bWJvbElkXHU2ODNDXHU1RjBGXHJcbiAgICBzeW1ib2xJZDogXCJpY29uLVtkaXJdLVtuYW1lXVwiLFxyXG4gIH0pLFxyXG4gIHRvcExldmVsQXdhaXQoe1xyXG4gICAgLy8gVGhlIGV4cG9ydCBuYW1lIG9mIHRvcC1sZXZlbCBhd2FpdCBwcm9taXNlIGZvciBlYWNoIGNodW5rIG1vZHVsZVxyXG4gICAgcHJvbWlzZUV4cG9ydE5hbWU6ICdfX3RsYScsXHJcbiAgICAvLyBUaGUgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgaW1wb3J0IG5hbWVzIG9mIHRvcC1sZXZlbCBhd2FpdCBwcm9taXNlIGluIGVhY2ggY2h1bmsgbW9kdWxlXHJcbiAgICBwcm9taXNlSW1wb3J0TmFtZTogaSA9PiBgX190bGFfJHtpfWBcclxuICB9KVxyXG5cclxuXHJcbiAgXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMnKVxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCIxMjcuMC4wLjFcIixcclxuICAgIHBvcnQ6IDgwODgsXHJcbiAgICBvcGVuOiB0cnVlLCAvLyBcdThGRDBcdTg4NENcdTY2MkZcdTU0MjZcdTgxRUFcdTUyQThcdTYyNTNcdTVGMDBcdTZENEZcdTg5QzhcdTU2NjhcclxuICAgIHByb3h5OiB7XHJcbiAgICAgICcvZGV2LWFwaS9sdSc6IHtcclxuICAgICAgICB0YXJnZXQ6J2h0dHA6Ly8xNDAuMTQzLjE1NC4yMTY6OTA1MScsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PlxyXG4gICAgICAgICAgcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoXCJeL2Rldi1hcGlcIiksIFwiXCIpLCAvLyBcdTY2RkZcdTYzNjIgL2Rldi1hcGkgXHU0RTNBIHRhcmdldCBcdTYzQTVcdTUzRTNcdTU3MzBcdTU3NDBcclxuICAgICAgfSxcclxuICAgICAgJy9kZXYtYXBpJzoge1xyXG4gICAgICAgIC8vIHRhcmdldDogXCJodHRwOi8vMTI3LjAuMC4xOjQ1MjMvbTEvMjg4NTgyMi0wLWRlZmF1bHRcIixcclxuICAgICAgICAvLyB0YXJnZXQ6ICdodHRwOi8vMTQwLjIwNy4xNjYuMjEwOjkwMzAnLFxyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xNDAuMjA3LjE2Ni4yMTA6OTAzMC9nYXRld2F5JyxcclxuICAgICAgICAvLyB0YXJnZXQ6ICdodHRwOi8vMTQwLjIwNy4xNjYuMjEwOjkwMzAvZ2F0ZXdheS9mYXJtJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+XHJcbiAgICAgICAgICBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChcIl4vZGV2LWFwaVwiKSwgXCJcIiksIC8vIFx1NjZGRlx1NjM2MiAvZGV2LWFwaSBcdTRFM0EgdGFyZ2V0IFx1NjNBNVx1NTNFM1x1NTczMFx1NTc0MFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgLy8gXHU4MUVBXHU1QjlBXHU0RTQ5XHU1NzMwXHU1NkZFXHU2NzBEXHU1MkExXHU0RUUzXHU3NDA2XHJcbiAgICAgICcvX0FNYXBTZXJ2aWNlL3Y0L21hcC9zdHlsZXMnOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly93ZWJhcGkuYW1hcC5jb20vdjQvbWFwL3N0eWxlcycsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBgJHtwYXRoLnJlcGxhY2UoL15cXC9fQU1hcFNlcnZpY2VcXC92NFxcL21hcFxcL3N0eWxlcy8sICcvdjQvbWFwL3N0eWxlcycpfT9qc2NvZGU9M2NiNjNlZDU5YzZlNDUzYWU3YWNiMDMxZjA5Njg2ODZgXHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIFx1NkQ3N1x1NTkxNlx1NTczMFx1NTZGRVx1NjcwRFx1NTJBMVx1NEVFM1x1NzQwNlxyXG4gICAgICAnL19BTWFwU2VydmljZS92My92ZWN0b3JtYXAnOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9mbWFwMDEuYW1hcC5jb20vdjMvdmVjdG9ybWFwJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IGAke3BhdGgucmVwbGFjZSgvXlxcL19BTWFwU2VydmljZVxcL3YzXFwvdmVjdG9ybWFwLywgJy92My92ZWN0b3JtYXAnKX0/anNjb2RlPTNjYjYzZWQ1OWM2ZTQ1M2FlN2FjYjAzMWYwOTY4Njg2YFxyXG4gICAgICB9LFxyXG4gICAgICAvLyBXZWJcdTY3MERcdTUyQTFBUElcdTRFRTNcdTc0MDZcclxuICAgICAgJy9fQU1hcFNlcnZpY2UnOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9yZXN0YXBpLmFtYXAuY29tJywgIC8vIFx1NUI5RVx1OTY0NVx1NzY4NFx1NjcwRFx1NTJBMVx1N0FFRlx1NTczMFx1NTc0MFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSwgIC8vIFx1NjUzOVx1NTNEOFx1OEJGN1x1NkM0Mlx1NkU5MFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBgJHtwYXRoLnJlcGxhY2UoL15cXC9fQU1hcFNlcnZpY2VcXC8vLCAnLycpfT9qc2NvZGU9M2NiNjNlZDU5YzZlNDUzYWU3YWNiMDMxZjA5Njg2ODZgICAvLyBcdTkxQ0RcdTUxOTlcdThCRjdcdTZDNDJcdThERUZcdTVGODRcclxuICAgICAgfSxcclxuICAgICAgLy9cdTc2N0VcdTVFQTZcdTU3MzBcdTU2RkVcclxuICAgICAgJy9hcGktYmFpZHUnOiB7XHJcbiAgICAgICAgdGFyZ2V0OiBiYWlkdVVybCxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IGAke3BhdGgucmVwbGFjZSgvXlxcL2FwaS1iYWlkdS8sICcnKX1gXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5USxTQUFTLG9CQUFvQjtBQUN0UyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBSWpCLFNBQVMsNEJBQTRCO0FBRXJDLE9BQU8sbUJBQW1CO0FBRTFCLElBQU0sV0FBVztBQUdqQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFBQyxJQUFJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQWdCZCxxQkFBcUI7QUFBQTtBQUFBLE1BRW5CLFVBQVUsQ0FBQyxLQUFLLFFBQVEsUUFBUSxJQUFJLEdBQUcsa0JBQWtCLENBQUM7QUFBQTtBQUFBLE1BRTFELFVBQVU7QUFBQSxJQUNaLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQTtBQUFBLE1BRVosbUJBQW1CO0FBQUE7QUFBQSxNQUVuQixtQkFBbUIsT0FBSyxTQUFTLENBQUM7QUFBQSxJQUNwQyxDQUFDO0FBQUEsRUFHRDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsUUFBUSxJQUFJLEdBQUcsS0FBSztBQUFBLElBQ3hDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxlQUFlO0FBQUEsUUFDYixRQUFPO0FBQUEsUUFDUCxjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUNBLFVBQ1JBLE1BQUssUUFBUSxJQUFJLE9BQU8sV0FBVyxHQUFHLEVBQUU7QUFBQTtBQUFBLE1BQzVDO0FBQUEsTUFDQSxZQUFZO0FBQUE7QUFBQTtBQUFBLFFBR1YsUUFBUTtBQUFBO0FBQUEsUUFFUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUNBLFVBQ1JBLE1BQUssUUFBUSxJQUFJLE9BQU8sV0FBVyxHQUFHLEVBQUU7QUFBQTtBQUFBLE1BQzVDO0FBQUE7QUFBQSxNQUdBLCtCQUErQjtBQUFBLFFBQzdCLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQ0EsVUFBUyxHQUFHQSxNQUFLLFFBQVEsb0NBQW9DLGdCQUFnQixDQUFDO0FBQUEsTUFDMUY7QUFBQTtBQUFBLE1BRUEsOEJBQThCO0FBQUEsUUFDNUIsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDQSxVQUFTLEdBQUdBLE1BQUssUUFBUSxrQ0FBa0MsZUFBZSxDQUFDO0FBQUEsTUFDdkY7QUFBQTtBQUFBLE1BRUEsaUJBQWlCO0FBQUEsUUFDZixRQUFRO0FBQUE7QUFBQSxRQUNSLGNBQWM7QUFBQTtBQUFBLFFBQ2QsU0FBUyxDQUFDQSxVQUFTLEdBQUdBLE1BQUssUUFBUSxxQkFBcUIsR0FBRyxDQUFDO0FBQUE7QUFBQSxNQUM5RDtBQUFBO0FBQUEsTUFFQSxjQUFjO0FBQUEsUUFDWixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUNBLFVBQVMsR0FBR0EsTUFBSyxRQUFRLGdCQUFnQixFQUFFLENBQUM7QUFBQSxNQUN4RDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
