/**
 * 测试用的 Mock Request 模块
 * 用于拦截 API 请求并返回 Mock 数据
 */

import { createMockResponse, mockDelay } from '@/api/mock'
import { machineryMock } from '@/api/mock/machinery'

// 路由配置：URL 匹配模式 -> Mock 处理器
const mockRoutes: Array<{
  pattern: RegExp
  method: string
  handler: (params?: any, data?: any, url?: string, config?: any) => any
}> = [
  // ==================== 机器列表相关 ====================
  // POST /farm/car/new/list - 机器列表
  { 
    pattern: /\/farm\/car\/new\/list/, 
    method: 'POST', 
    handler: (_, data) => machineryMock.carNewList(data)
  },
  
  // GET /farm/car/new/detail - 机器详情
  { 
    pattern: /\/farm\/car\/new\/detail.*carId=(\d+)/, 
    method: 'GET', 
    handler: (params) => machineryMock.carNewDetail(Number(params?.carId) || 1, 0)
  },
  
  // GET /farm/car/dealer - 经销商列表
  { 
    pattern: /\/farm\/car\/dealer/, 
    method: 'GET', 
    handler: () => machineryMock.carDealer()
  },
  
  // POST /farm/car/status - 控制星基开关
  { 
    pattern: /\/farm\/car\/status/, 
    method: 'POST', 
    handler: (_, data) => machineryMock.carStatus(data)
  },
  
  // POST /farm/log/choice - 控制日志上传
  { 
    pattern: /\/farm\/log\/choice.*sn=([^&]+).*flag=([^&]+)/, 
    method: 'POST', 
    handler: (params, _, url) => {
      const sn = url.match(/sn=([^&]+)/)?.[1] || ''
      const flag = url.match(/flag=([^&]+)/)?.[1] || '0'
      return machineryMock.logChoice(sn, flag)
    }
  },
  
  // PUT 请求通用处理（用于测试）
  {
    pattern: /\/farm\/car\/status/,
    method: 'PUT',
    handler: (_, data) => createMockResponse({ success: true, data })
  },
  
  // DELETE 请求通用处理（用于测试）
  {
    pattern: /\/farm\/farm-base\/delete/,
    method: 'DELETE',
    handler: (params) => createMockResponse({ success: true, id: params?.id })
  },
  
  // GET /farm/car/terminalType - 终端类型列表
  { 
    pattern: /\/farm\/car\/terminalType/, 
    method: 'GET', 
    handler: () => machineryMock.terminalTypeList()
  },
  
  // GET /farm/car/softList - 软件版本列表
  { 
    pattern: /\/farm\/car\/softList/, 
    method: 'GET', 
    handler: (params) => machineryMock.softList(params)
  },
  
  // POST /farm/car/getTypeSnBySoft - 软件对应SN列表
  { 
    pattern: /\/farm\/car\/getTypeSnBySoft/, 
    method: 'POST', 
    handler: (_, data) => machineryMock.getTypeSnBySoft(data)
  },
  
  // POST /farm/car/new/packageUpgradeList - 批量升级
  { 
    pattern: /\/farm\/car\/new\/packageUpgradeList/, 
    method: 'POST', 
    handler: (_, data) => machineryMock.packageUpgradeList(data)
  },
  
  // GET /farmPoint/point/singleCarTrack - 历史轨迹
  { 
    pattern: /\/farmPoint\/point\/singleCarTrack/, 
    method: 'GET', 
    handler: (params) => machineryMock.singleCarTrack(params)
  },
  
  // GET /farm/activationCode/getDays - 注册码天数
  { 
    pattern: /\/farm\/activationCode\/getDays/, 
    method: 'GET', 
    handler: (params) => machineryMock.getActivationCodeDays(params)
  },
  
  // POST /farm/activationCode/pushCode - 取注册码
  { 
    pattern: /\/farm\/activationCode\/pushCode/, 
    method: 'POST', 
    handler: (params) => machineryMock.pushActivationCode(params)
  },
  
  // GET /farm/activationCode/getCodePushLogs - 取注册码日志
  { 
    pattern: /\/farm\/activationCode\/getCodePushLogs/, 
    method: 'GET', 
    handler: (params) => machineryMock.getActivationCodeLogs(params)
  },
  
  // ==================== 通用 /api 路径 (简化测试) ====================
  { 
    pattern: /\/api\/machinery\/list/, 
    method: 'GET', 
    handler: (params) => machineryMock.carNewList(params)
  },
  { 
    pattern: /\/api\/machinery\/\d+/, 
    method: 'GET', 
    handler: (params, _, url) => {
      const id = parseInt(url.match(/\/(\d+)(\?|$)/)?.[1] || '1')
      return machineryMock.carNewDetail(id, 0)
    }
  },
  { 
    pattern: /\/api\/machinery/, 
    method: 'POST', 
    handler: (_, data) => createMockResponse({ id: Date.now(), ...data })
  },
  
  // ==================== 用户认证相关 ====================
  // POST /auth/oauth/token - 登录
  { 
    pattern: /\/auth\/oauth\/token/, 
    method: 'POST', 
    handler: (_, data) => createMockResponse({
      access_token: `mock-access-token-${Date.now()}`,
      refresh_token: `mock-refresh-token-${Date.now()}`,
      token_type: 'bearer',
      expires_in: 7200,
      scope: 'all',
      data: {
        id: 1,
        username: data?.username || 'admin',
        name: '测试用户',
        role: 'admin'
      }
    })
  },
  
  // GET /api/user/info - 用户信息
  { 
    pattern: /\/api\/user\/info/, 
    method: 'GET', 
    handler: () => createMockResponse({
      id: 1,
      username: 'admin',
      name: '测试用户',
      role: 'admin',
      permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      email: 'admin@example.com',
      phone: '13800138000',
      avatar: ''
    })
  },
  
  // POST /auth/oauth/token (refresh_token) - 刷新token
  { 
    pattern: /\/auth\/oauth\/token/, 
    method: 'POST', 
    handler: (params) => {
      if (params?.grant_type === 'refresh_token') {
        return createMockResponse({
          access_token: `new-mock-token-${Date.now()}`,
          refresh_token: `new-refresh-token-${Date.now()}`,
          token_type: 'bearer',
          expires_in: 7200
        })
      }
      return createMockResponse({ access_token: 'mock-token' })
    }
  },
  
  // ==================== 农场管理相关 ====================
  // GET /farm/farm-base/page - 农场分页列表
  { 
    pattern: /\/farm\/farm-base\/page/, 
    method: 'GET', 
    handler: (params) => {
      const list = Array(10).fill(null).map((_, i) => ({
        id: i + 1,
        farmName: `农场${i + 1}`,
        area: Math.floor(Math.random() * 1000),
        address: `某省某市某区${i + 1}号`,
        createTime: '2024-01-01 00:00:00'
      }))
      return createMockResponse({ list, total: 100, page: params?.page || 1 })
    }
  },
  
  // DELETE /farm/farm-base/delete - 删除农场
  { 
    pattern: /\/farm\/farm-base\/delete/, 
    method: 'DELETE', 
    handler: (params) => createMockResponse({ success: true, id: params?.id })
  }
]

// 查找匹配的 Mock 处理器
function findMockHandler(url: string, method: string) {
  const upperMethod = method.toUpperCase()
  
  return mockRoutes.find(r => {
    // 检查方法匹配
    if (r.method !== upperMethod) return false
    
    // 检查 URL 匹配
    return r.pattern.test(url)
  })?.handler
}

// 从 URL 解析参数
function parseUrlParams(url: string): Record<string, any> {
  const params: Record<string, any> = {}
  const queryIndex = url.indexOf('?')
  
  if (queryIndex !== -1) {
    const queryString = url.slice(queryIndex + 1)
    const searchParams = new URLSearchParams(queryString)
    searchParams.forEach((value, key) => {
      params[key] = value
    })
  }
  
  return params
}

// Mock Request 类
class MockRequest {
  private enabled: boolean = true
  private requestCount: number = 0
  
  // 启用/禁用 Mock
  enable() { 
    this.enabled = true 
    console.log('[MockRequest] 已启用')
  }
  disable() { 
    this.enabled = false 
    console.log('[MockRequest] 已禁用')
  }
  
  isEnabled() { return this.enabled }
  
  getRequestCount() { return this.requestCount }
  resetCount() { this.requestCount = 0 }
  
  async request(config: any) {
    if (!this.enabled) {
      throw new Error('[MockRequest] Mock is disabled')
    }
    
    const { url, method = 'GET', data, params: configParams } = config
    this.requestCount++
    
    // 合并 URL 参数和配置参数
    const urlParams = parseUrlParams(url)
    const mergedParams = { ...urlParams, ...configParams }
    
    console.log(`[MockRequest] ${method} ${url}`, { params: mergedParams, data })
    
    // 模拟网络延迟（100-500ms 随机）
    const delay = 100 + Math.random() * 400
    await mockDelay(delay)
    
    // 查找 Mock 处理器
    const handler = findMockHandler(url, method)
    
    if (handler) {
      const result = handler(mergedParams, data, url, config)
      
      // 模拟 axios 响应结构
      return {
        data: result,
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config
      }
    }
    
    // 未匹配的请求返回 404
    console.warn(`[MockRequest] No handler found for: ${method} ${url}`)
    return {
      data: createMockResponse(null, 404),
      status: 404,
      statusText: 'Not Found',
      headers: {},
      config
    }
  }
  
  // 模拟 GET 请求
  async get(url: string, config?: any) {
    return this.request({ ...config, url, method: 'GET' })
  }
  
  // 模拟 POST 请求
  async post(url: string, data?: any, config?: any) {
    return this.request({ ...config, url, method: 'POST', data })
  }
  
  // 模拟 PUT 请求
  async put(url: string, data?: any, config?: any) {
    return this.request({ ...config, url, method: 'PUT', data })
  }
  
  // 模拟 DELETE 请求
  async delete(url: string, config?: any) {
    return this.request({ ...config, url, method: 'DELETE' })
  }
  
  // 模拟 PATCH 请求
  async patch(url: string, data?: any, config?: any) {
    return this.request({ ...config, url, method: 'PATCH', data })
  }
}

// 创建单例
export const mockRequest = new MockRequest()

// 快捷导出
export const mockGet = (url: string, config?: any) => mockRequest.get(url, config)
export const mockPost = (url: string, data?: any, config?: any) => mockRequest.post(url, data, config)
export const mockPut = (url: string, data?: any, config?: any) => mockRequest.put(url, data, config)
export const mockDelete = (url: string, config?: any) => mockRequest.delete(url, config)
export const mockPatch = (url: string, data?: any, config?: any) => mockRequest.patch(url, data, config)

// 测试辅助函数
export const enableMock = () => mockRequest.enable()
export const disableMock = () => mockRequest.disable()
export const isMockEnabled = () => mockRequest.isEnabled()
export const getMockRequestCount = () => mockRequest.getRequestCount()
export const resetMockCount = () => mockRequest.resetCount()

export default mockRequest
