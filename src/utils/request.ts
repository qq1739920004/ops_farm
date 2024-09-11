import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from "element-plus";
import { errorCode } from "./code";
import i18n from "@/lang/index"
import useUserStore from '@/store/user'
const userStore = useUserStore()
import { ElLoading } from 'element-plus'
let loadingInstance: any;
// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  //超时时间改成2分钟
  timeout: 60000,
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
    if (response.headers["token-expire"]) {
      tokenRenewal();
    }

    let { code, message, type, data } = response.data;

    // 响应数据为二进制流处理(Excel导出)
    if (response.data instanceof ArrayBuffer || response.data instanceof Blob) {
      return response.data;
    } else {
      if (code === 0 || code === 200 || code === 'ok') {
        return response.data;
        // if (data.errorMessageList) {
        //   ElMessage.error(data.errorMessageList[0].message)
        // } else {
        // }
      } else {
        if (errorCode[code]) {
          type === 3 ? ElMessage.error(i18n.global.t(errorCode[code])) : ElMessage.warning(i18n.global.t(errorCode[code]));
        } else {
          type === 3 ? ElMessage.error(response.data.message) : ElMessage.warning(response.data.message);

        }


      }
    }

    return Promise.reject(new Error(message || 'Error'));
  },
  (error: any) => {
    loadingInstance.close()
    const { status } = error.response;
    if (status == 401) {
      userStore.clearUserInfo()
      // 前往登录页面
      process.env.NODE_ENV !== "development"
        ? (location.href = `${location.origin}/#/login?clientUrl=${location.href}`)
        : "";

    } else if (status == 403) {
      ElMessage.warning(i18n.global.t('messages.noPer'));
    } else {
      ElMessage.error('请求错误,稍后重试');
    }
    return Promise.reject(error.message);
  }
);

let tokenRenewalFlag = true;
async function tokenRenewal() {
  if (!tokenRenewalFlag) return;
  tokenRenewalFlag = false;
  let data = {
    grant_type: "refresh_token",
    client_id: "client",
    client_secret: 123123,
    scope: "all",
    refresh_token: userStore.refresh_token,
  };
  const res = await service({
    url: "/auth/oauth/token",
    method: "post",
    params: data,
  });

  tokenRenewalFlag = true;
  userStore.updateAuthorization(`bearer ${res.data.access_token}`)
  userStore.updateRefreshToken(`${res.data.refresh_token}`)
}

declare module "axios" {
  interface AxiosResponse<T = any> {
    code: number;
    message: string;
  }
  export function create(config?: AxiosRequestConfig): AxiosInstance;
}

// 导出 axios 实例
export default service;
