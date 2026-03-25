/**
 * Cypress Mock 配置
 * 用于统一管理 Mock 数据和配置
 */

export interface MockConfig {
  // 是否启用 Mock
  enabled: boolean
  // Mock 延迟时间（毫秒）
  delay: number
  // 是否打印 Mock 日志
  logRequests: boolean
}

// 默认配置
export const defaultMockConfig: MockConfig = {
  enabled: true,
  delay: 300,
  logRequests: true
}

// 当前配置
let currentConfig: MockConfig = { ...defaultMockConfig }

// 更新配置
export const setMockConfig = (config: Partial<MockConfig>) => {
  currentConfig = { ...currentConfig, ...config }
}

// 获取配置
export const getMockConfig = () => currentConfig

// Mock 数据生成器
export const generateMockMachineryList = (count: number = 10) => {
  return Array(count).fill(null).map((_, index) => ({
    id: index + 1,
    sn: `SINO${String(Math.random()).slice(2, 10).toUpperCase()}`,
    carName: `测试机器${index + 1}`,
    terminalType: ['T20', 'T30', 'T50'][Math.floor(Math.random() * 3)],
    dealerName: `经销商${Math.floor(Math.random() * 5) + 1}`,
    status: Math.random() > 0.3 ? 1 : 0,
    voltage: Math.floor(Math.random() * 4),
    netSignal: Math.floor(Math.random() * 5) + 1,
    health: Math.floor(Math.random() * 9),
    createTime: '2024-01-15 10:30:00',
    ownerName: `用户${Math.floor(Math.random() * 50) + 1}`,
    lat: 30.0 + Math.random() * 10,
    lng: 110.0 + Math.random() * 20,
    workArea: Math.floor(Math.random() * 500) / 10,
    softVersion: `V${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`
  }))
}

// 从环境变量读取配置
export const initMockConfigFromEnv = () => {
  const envConfig: Partial<MockConfig> = {}
  
  if (Cypress.env('MOCK_ENABLED') !== undefined) {
    envConfig.enabled = Cypress.env('MOCK_ENABLED') === 'true'
  }
  
  if (Cypress.env('MOCK_DELAY')) {
    envConfig.delay = parseInt(Cypress.env('MOCK_DELAY'), 10)
  }
  
  if (Cypress.env('MOCK_LOG') !== undefined) {
    envConfig.logRequests = Cypress.env('MOCK_LOG') === 'true'
  }
  
  setMockConfig(envConfig)
}

// 初始化
initMockConfigFromEnv()
