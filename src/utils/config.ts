// 运行时配置获取工具

interface AppConfig {
  VITE_ENV: string;
  VITE_APP_BASE_API: string;
  VITE_APP_BASE_BAIDU: string;
  VITE_APP_nogate_API: string;
  VITE_APP_BASE_WS: string;
  VITE_APP_Model: string;
}

// 获取运行时配置
export function getRuntimeConfig(): AppConfig {
  // 判断当前是否是开发环境
  const isDev = import.meta.env.DEV;
  
  // 在开发环境下，始终使用环境变量
  if (isDev) {
    console.log('开发环境: 使用.env文件中的变量');
    return {
      VITE_ENV: import.meta.env.VITE_ENV || 'development',
      VITE_APP_BASE_API: import.meta.env.VITE_APP_BASE_API || '/gateway',
      VITE_APP_BASE_BAIDU: 'https://api.map.baidu.com', // 百度地图地址固定不变
      VITE_APP_nogate_API: import.meta.env.VITE_APP_nogate_API || '',
      VITE_APP_BASE_WS: import.meta.env.VITE_APP_BASE_WS || 'ws://140.207.166.210:9034/websocket',
      VITE_APP_Model: import.meta.env.VITE_APP_Model || '1'
    };
  }
  
  // 生产环境下，优先使用运行时配置
  const runtimeConfig = (window as any).APP_CONFIG;
  
  if (runtimeConfig) {
    // 在运行时配置中添加环境标识，因为它已从客户可修改的配置中移除
    return {
      ...runtimeConfig,
      VITE_ENV: import.meta.env.VITE_ENV || 'production'
    };
  }
  // 如果没有运行时配置，使用构建时的环境变量作为fallback
  return {
    VITE_ENV: import.meta.env.VITE_ENV || 'production',
    VITE_APP_BASE_API: import.meta.env.VITE_APP_BASE_API || '/gateway',
    VITE_APP_BASE_BAIDU: 'https://api.map.baidu.com', // 百度地图地址固定不变
    VITE_APP_nogate_API: import.meta.env.VITE_APP_nogate_API || '',
    VITE_APP_BASE_WS: (window as any).CONFIG_BASE_WS || import.meta.env.VITE_APP_BASE_WS || 'ws://140.207.166.210:9034/websocket',
    VITE_APP_Model: import.meta.env.VITE_APP_Model || '1'
  };
}

// 不再预先创建缓存对象，而是导出 getter 函数
export const config = {
  get VITE_ENV() { return getRuntimeConfig().VITE_ENV; },
  get VITE_APP_BASE_API() { return getRuntimeConfig().VITE_APP_BASE_API; },
  get VITE_APP_BASE_BAIDU() { return getRuntimeConfig().VITE_APP_BASE_BAIDU; },
  get VITE_APP_nogate_API() { return getRuntimeConfig().VITE_APP_nogate_API; },
  get VITE_APP_BASE_WS() { return getRuntimeConfig().VITE_APP_BASE_WS; },
  get VITE_APP_Model() { return getRuntimeConfig().VITE_APP_Model; }
};
