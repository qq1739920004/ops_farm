/**
 * API Mock 数据
 * 用于测试时模拟接口响应
 */

// 模拟延迟
export const mockDelay = (ms: number = 300) => 
  new Promise(resolve => setTimeout(resolve, ms))

// 通用响应结构
export const createMockResponse = <T>(data: T, code: number = 200) => ({
  code,
  data,
  message: code === 200 ? 'success' : 'error'
})

// ==================== 机器列表 Mock ====================
export const machineryListMock = {
  // 机器列表数据
  getList: (params?: any) => {
    const page = params?.page || 1
    const limit = params?.limit || 10
    
    const mockData = Array(limit).fill(null).map((_, index) => ({
      id: (page - 1) * limit + index + 1,
      sn: `SN${String(Math.random()).slice(2, 12)}`,
      name: `机器${(page - 1) * limit + index + 1}`,
      type: ['拖拉机', '收割机', '播种机'][Math.floor(Math.random() * 3)],
      status: Math.random() > 0.3 ? '在线' : '离线',
      createTime: new Date().toISOString(),
      owner: `用户${Math.floor(Math.random() * 100)}`,
      voltage: Math.floor(Math.random() * 4),
      health: Math.floor(Math.random() * 9),
    }))
    
    return createMockResponse({
      list: mockData,
      total: 100,
      page,
      limit
    })
  },
  
  // 机器详情
  getDetail: (id: number) => createMockResponse({
    id,
    sn: `SN${String(Math.random()).slice(2, 12)}`,
    name: `机器${id}`,
    type: '拖拉机',
    status: '在线',
    createTime: '2024-01-01 00:00:00',
    owner: '测试用户',
    description: '这是一台测试机器',
    location: {
      lat: 39.9042,
      lng: 116.4074
    }
  }),
  
  // 创建机器
  create: (data: any) => createMockResponse({
    id: Date.now(),
    ...data,
    createTime: new Date().toISOString()
  }),
  
  // 更新机器
  update: (id: number, data: any) => createMockResponse({
    id,
    ...data,
    updateTime: new Date().toISOString()
  }),
  
  // 删除机器
  delete: (id: number) => createMockResponse({ success: true })
}

// ==================== 用户相关 Mock ====================
export const userMock = {
  // 登录
  login: (credentials: any) => createMockResponse({
    access_token: 'mock-token-' + Date.now(),
    refresh_token: 'mock-refresh-' + Date.now(),
    expires_in: 7200,
    userInfo: {
      id: 1,
      username: credentials.username || 'admin',
      name: '测试用户',
      role: 'admin',
      avatar: ''
    }
  }),
  
  // 获取用户信息
  getUserInfo: () => createMockResponse({
    id: 1,
    username: 'admin',
    name: '测试用户',
    role: 'admin',
    permissions: [1, 2, 3, 4, 5],
    email: 'test@example.com',
    phone: '13800138000'
  }),
  
  // 刷新 Token
  refreshToken: (refresh_token: string) => createMockResponse({
    access_token: 'new-mock-token-' + Date.now(),
    refresh_token: 'new-mock-refresh-' + Date.now(),
    expires_in: 7200
  })
}

// ==================== 信息查询 Mock ====================
export const infoManagementMock = {
  // 获取基础信息
  getBasicInfo: () => createMockResponse({
    username: '测试客户',
    tel: '13800138000',
    companyName: '测试经销商',
    creatorName: '管理员',
    code: 'REG123456',
    netDate: '2024-01-01 00:00:00',
    warrantyDate: '2025-01-01 00:00:00'
  }),
  
  // 获取统计信息
  getStatistics: () => createMockResponse({
    totalMachines: 100,
    onlineMachines: 75,
    offlineMachines: 25,
    alertCount: 5,
    workHours: 1234.5
  })
}

// ==================== 作业管理 Mock ====================
export const jobManagementMock = {
  // 任务列表
  getTaskList: (params?: any) => {
    const mockData = Array(10).fill(null).map((_, index) => ({
      id: index + 1,
      name: `任务${index + 1}`,
      type: ['耕地', '播种', '收割'][Math.floor(Math.random() * 3)],
      status: ['进行中', '已完成', '待开始'][Math.floor(Math.random() * 3)],
      progress: Math.floor(Math.random() * 100),
      startTime: '2024-01-01 08:00:00',
      endTime: '2024-01-01 18:00:00',
      area: Math.floor(Math.random() * 100),
      machineName: `机器${Math.floor(Math.random() * 10)}`
    }))
    
    return createMockResponse({
      list: mockData,
      total: 50
    })
  }
}

// ==================== Mock API 总入口 ====================
export const mockAPI = {
  machinery: machineryListMock,
  user: userMock,
  info: infoManagementMock,
  job: jobManagementMock
}

export default mockAPI
