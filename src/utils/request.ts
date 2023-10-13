import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from "element-plus";
import useUserStore from '@/store/user'
const userStore = useUserStore()
import { ElLoading } from 'element-plus'
let loadingInstance: any;
// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

    config.headers["Authorization"] = userStore.Authorization;
    loadingInstance = ElLoading.service({
      lock: true,
      text: "Loading",
      background: 'rgba(0, 0, 0, 0.3)',
    });

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    loadingInstance.close()
    const { code, message } = response.data;
    if (code === 0 || code === 200 || code === 'ok') {
      return response.data;
    }
    // 响应数据为二进制流处理(Excel导出)
    if (response.data instanceof ArrayBuffer || response.data instanceof Blob) {
      return response.data;
    }
    console.log(response)
    // ElMessage.error(msg || '系统出错');
    return Promise.reject(new Error(message || 'Error'));
  },
  (error: any) => {
    loadingInstance.close()
    const { status } = error.response;
    if (status == 403) {
      ElMessage.error('暂无权限');

    } else if (status == 401) {
      // 前往登录页面
      process.env.NODE_ENV !== "development"
        ? (location.href = `${location.origin}/#/login?clientUrl=${location.href}`)
        : "";
    } else {
      ElMessage.error('请求错误,稍后重试');
    }
    return Promise.reject(error.message);
  }
);

declare module "axios" {
  interface AxiosResponse<T = any> {
    code: number;
    message: string;
  }
  export function create(config?: AxiosRequestConfig): AxiosInstance;
}

// 导出 axios 实例
export default service;
