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
        //  target: 'http://140.207.166.210:9030/gateway',
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
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx1c2VyXFxcXERlc2t0b3BcXFxcXHU1MTZDXHU1M0Y4cHJvamVjdFxcXFxvcHNfZmFybVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcdXNlclxcXFxEZXNrdG9wXFxcXFx1NTE2Q1x1NTNGOHByb2plY3RcXFxcb3BzX2Zhcm1cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3VzZXIvRGVza3RvcC8lRTUlODUlQUMlRTUlOEYlQjhwcm9qZWN0L29wc19mYXJtL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcblxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbi8vIGltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1zdmctaWNvbnNcIjtcbi8vIGltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgdG9wTGV2ZWxBd2FpdCBmcm9tICd2aXRlLXBsdWdpbi10b3AtbGV2ZWwtYXdhaXQnXG5cbmNvbnN0IGJhaWR1VXJsID0gYGh0dHBzOi8vYXBpLm1hcC5iYWlkdS5jb21gO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYmFzZTogXCIuL1wiLFxuICBwbHVnaW5zOiBbdnVlKCksXG4gIC8vIEF1dG9JbXBvcnQoe1xuICAvLyBBdXRvIGltcG9ydCBmdW5jdGlvbnMgZnJvbSBWdWUsIGUuZy4gcmVmLCByZWFjdGl2ZSwgdG9SZWYuLi5cbiAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IFZ1ZSBcdTc2RjhcdTUxNzNcdTUxRkRcdTY1NzBcdUZGMENcdTU5ODJcdUZGMUFyZWYsIHJlYWN0aXZlLCB0b1JlZiBcdTdCNDlcbiAgLy8gaW1wb3J0czogW1widnVlXCJdLFxuXG4gIC8vIEF1dG8gaW1wb3J0IGZ1bmN0aW9ucyBmcm9tIEVsZW1lbnQgUGx1cywgZS5nLiBFbE1lc3NhZ2UsIEVsTWVzc2FnZUJveC4uLiAod2l0aCBzdHlsZSlcbiAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IEVsZW1lbnQgUGx1cyBcdTc2RjhcdTUxNzNcdTUxRkRcdTY1NzBcdUZGMENcdTU5ODJcdUZGMUFFbE1lc3NhZ2UsIEVsTWVzc2FnZUJveC4uLiAoXHU1RTI2XHU2ODM3XHU1RjBGKVxuICAvLyByZXNvbHZlcnM6IFtcbiAgLy8gRWxlbWVudFBsdXNSZXNvbHZlcigpXG4gIC8vIF0sXG5cbiAgLy8gfSksXG4gIC8vIENvbXBvbmVudHMoe1xuICAvLyAgIGRpcnM6IFsnc3JjL2NvbXBvbmVudHMnXSwgLy8gXHU2MzA5XHU5NzAwXHU1MkEwXHU4RjdEXHU3Njg0XHU2NTg3XHU0RUY2XHU1OTM5XG4gIC8vIH0pLFxuICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XG4gICAgLy8gXHU2MzA3XHU1QjlBXHU5NzAwXHU4OTgxXHU3RjEzXHU1QjU4XHU3Njg0XHU1NkZFXHU2ODA3XHU2NTg3XHU0RUY2XHU1OTM5XG4gICAgaWNvbkRpcnM6IFtwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgXCJzcmMvYXNzZXRzL2ljb25zXCIpXSxcbiAgICAvLyBcdTYzMDdcdTVCOUFzeW1ib2xJZFx1NjgzQ1x1NUYwRlxuICAgIHN5bWJvbElkOiBcImljb24tW2Rpcl0tW25hbWVdXCIsXG4gIH0pLFxuICB0b3BMZXZlbEF3YWl0KHtcbiAgICAvLyBUaGUgZXhwb3J0IG5hbWUgb2YgdG9wLWxldmVsIGF3YWl0IHByb21pc2UgZm9yIGVhY2ggY2h1bmsgbW9kdWxlXG4gICAgcHJvbWlzZUV4cG9ydE5hbWU6ICdfX3RsYScsXG4gICAgLy8gVGhlIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGltcG9ydCBuYW1lcyBvZiB0b3AtbGV2ZWwgYXdhaXQgcHJvbWlzZSBpbiBlYWNoIGNodW5rIG1vZHVsZVxuICAgIHByb21pc2VJbXBvcnROYW1lOiBpID0+IGBfX3RsYV8ke2l9YFxuICB9KVxuXG5cbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMnKVxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiMTI3LjAuMC4xXCIsXG4gICAgcG9ydDogODA4OCxcbiAgICBvcGVuOiB0cnVlLCAvLyBcdThGRDBcdTg4NENcdTY2MkZcdTU0MjZcdTgxRUFcdTUyQThcdTYyNTNcdTVGMDBcdTZENEZcdTg5QzhcdTU2NjhcbiAgICBwcm94eToge1xuICAgICAgJy9kZXYtYXBpL2x1Jzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTQwLjE0My4xNTQuMjE2OjkwNTEnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PlxuICAgICAgICAgIHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKFwiXi9kZXYtYXBpXCIpLCBcIlwiKSwgLy8gXHU2NkZGXHU2MzYyIC9kZXYtYXBpIFx1NEUzQSB0YXJnZXQgXHU2M0E1XHU1M0UzXHU1NzMwXHU1NzQwXG4gICAgICB9LFxuICAgICAgJy9kZXYtYXBpJzoge1xuICAgICAgICAvLyB0YXJnZXQ6IFwiaHR0cDovLzEyNy4wLjAuMTo0NTIzL20xLzI4ODU4MjItMC1kZWZhdWx0XCIsXG4gICAgICAgIC8vIHRhcmdldDogJ2h0dHA6Ly8xNDAuMjA3LjE2Ni4yMTA6OTAzMCcsXG4gICAgICAgIC8vICB0YXJnZXQ6ICdodHRwOi8vMTQwLjIwNy4xNjYuMjEwOjkwMzAvZ2F0ZXdheScsXG4gICAgICAgICB0YXJnZXQ6ICdodHRwczovL2Nsb3VkLnNpbm9nbnNzLmNvbS9nYXRld2F5JyxcbiAgICAgICAgLy90YXJnZXQ6ICdodHRwOi8vMTQwLjIwNy4xNjYuMjEwOjkwMzAvZ2F0ZXdheS9mYXJtJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT5cbiAgICAgICAgICBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChcIl4vZGV2LWFwaVwiKSwgXCJcIiksIC8vIFx1NjZGRlx1NjM2MiAvZGV2LWFwaSBcdTRFM0EgdGFyZ2V0IFx1NjNBNVx1NTNFM1x1NTczMFx1NTc0MFxuICAgICAgfSxcblxuICAgICAgLy8gXHU4MUVBXHU1QjlBXHU0RTQ5XHU1NzMwXHU1NkZFXHU2NzBEXHU1MkExXHU0RUUzXHU3NDA2XG4gICAgICAnL19BTWFwU2VydmljZS92NC9tYXAvc3R5bGVzJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwczovL3dlYmFwaS5hbWFwLmNvbS92NC9tYXAvc3R5bGVzJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gYCR7cGF0aC5yZXBsYWNlKC9eXFwvX0FNYXBTZXJ2aWNlXFwvdjRcXC9tYXBcXC9zdHlsZXMvLCAnL3Y0L21hcC9zdHlsZXMnKX0/anNjb2RlPTNjYjYzZWQ1OWM2ZTQ1M2FlN2FjYjAzMWYwOTY4Njg2YFxuICAgICAgfSxcbiAgICAgIC8vIFx1NkQ3N1x1NTkxNlx1NTczMFx1NTZGRVx1NjcwRFx1NTJBMVx1NEVFM1x1NzQwNlxuICAgICAgJy9fQU1hcFNlcnZpY2UvdjMvdmVjdG9ybWFwJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwczovL2ZtYXAwMS5hbWFwLmNvbS92My92ZWN0b3JtYXAnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBgJHtwYXRoLnJlcGxhY2UoL15cXC9fQU1hcFNlcnZpY2VcXC92M1xcL3ZlY3Rvcm1hcC8sICcvdjMvdmVjdG9ybWFwJyl9P2pzY29kZT0zY2I2M2VkNTljNmU0NTNhZTdhY2IwMzFmMDk2ODY4NmBcbiAgICAgIH0sXG4gICAgICAvLyBXZWJcdTY3MERcdTUyQTFBUElcdTRFRTNcdTc0MDZcbiAgICAgICcvX0FNYXBTZXJ2aWNlJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwczovL3Jlc3RhcGkuYW1hcC5jb20nLCAgLy8gXHU1QjlFXHU5NjQ1XHU3Njg0XHU2NzBEXHU1MkExXHU3QUVGXHU1NzMwXHU1NzQwXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSwgIC8vIFx1NjUzOVx1NTNEOFx1OEJGN1x1NkM0Mlx1NkU5MFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gYCR7cGF0aC5yZXBsYWNlKC9eXFwvX0FNYXBTZXJ2aWNlXFwvLywgJy8nKX0/anNjb2RlPTNjYjYzZWQ1OWM2ZTQ1M2FlN2FjYjAzMWYwOTY4Njg2YCAgLy8gXHU5MUNEXHU1MTk5XHU4QkY3XHU2QzQyXHU4REVGXHU1Rjg0XG4gICAgICB9LFxuICAgICAgLy9cdTc2N0VcdTVFQTZcdTU3MzBcdTU2RkVcbiAgICAgICcvYXBpLWJhaWR1Jzoge1xuICAgICAgICB0YXJnZXQ6IGJhaWR1VXJsLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBgJHtwYXRoLnJlcGxhY2UoL15cXC9hcGktYmFpZHUvLCAnJyl9YFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzVSxTQUFTLG9CQUFvQjtBQUNuVyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBSWpCLFNBQVMsNEJBQTRCO0FBRXJDLE9BQU8sbUJBQW1CO0FBRTFCLElBQU0sV0FBVztBQUdqQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFBQyxJQUFJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQWdCZCxxQkFBcUI7QUFBQTtBQUFBLE1BRW5CLFVBQVUsQ0FBQyxLQUFLLFFBQVEsUUFBUSxJQUFJLEdBQUcsa0JBQWtCLENBQUM7QUFBQTtBQUFBLE1BRTFELFVBQVU7QUFBQSxJQUNaLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQTtBQUFBLE1BRVosbUJBQW1CO0FBQUE7QUFBQSxNQUVuQixtQkFBbUIsT0FBSyxTQUFTLENBQUM7QUFBQSxJQUNwQyxDQUFDO0FBQUEsRUFHRDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsUUFBUSxJQUFJLEdBQUcsS0FBSztBQUFBLElBQ3hDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUNBLFVBQ1JBLE1BQUssUUFBUSxJQUFJLE9BQU8sV0FBVyxHQUFHLEVBQUU7QUFBQTtBQUFBLE1BQzVDO0FBQUEsTUFDQSxZQUFZO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFJVCxRQUFRO0FBQUE7QUFBQSxRQUVULGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQ0EsVUFDUkEsTUFBSyxRQUFRLElBQUksT0FBTyxXQUFXLEdBQUcsRUFBRTtBQUFBO0FBQUEsTUFDNUM7QUFBQTtBQUFBLE1BR0EsK0JBQStCO0FBQUEsUUFDN0IsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDQSxVQUFTLEdBQUdBLE1BQUssUUFBUSxvQ0FBb0MsZ0JBQWdCLENBQUM7QUFBQSxNQUMxRjtBQUFBO0FBQUEsTUFFQSw4QkFBOEI7QUFBQSxRQUM1QixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUNBLFVBQVMsR0FBR0EsTUFBSyxRQUFRLGtDQUFrQyxlQUFlLENBQUM7QUFBQSxNQUN2RjtBQUFBO0FBQUEsTUFFQSxpQkFBaUI7QUFBQSxRQUNmLFFBQVE7QUFBQTtBQUFBLFFBQ1IsY0FBYztBQUFBO0FBQUEsUUFDZCxTQUFTLENBQUNBLFVBQVMsR0FBR0EsTUFBSyxRQUFRLHFCQUFxQixHQUFHLENBQUM7QUFBQTtBQUFBLE1BQzlEO0FBQUE7QUFBQSxNQUVBLGNBQWM7QUFBQSxRQUNaLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQ0EsVUFBUyxHQUFHQSxNQUFLLFFBQVEsZ0JBQWdCLEVBQUUsQ0FBQztBQUFBLE1BQ3hEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
