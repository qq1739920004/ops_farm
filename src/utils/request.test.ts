import { describe, it, expect, beforeEach, vi } from 'vitest'
import mockRequest, { 
  enableMock, 
  disableMock, 
  resetMockCount,
  getMockRequestCount,
  mockGet,
  mockPost,
  mockPut,
  mockDelete
} from './request.mock'

describe('Mock Request 测试', () => {
  beforeEach(() => {
    enableMock()
    resetMockCount()
  })

  describe('基本功能', () => {
    it('应能启用和禁用 Mock', () => {
      expect(mockRequest.isEnabled()).toBe(true)
      
      disableMock()
      expect(mockRequest.isEnabled()).toBe(false)
      
      enableMock()
      expect(mockRequest.isEnabled()).toBe(true)
    })

    it('禁用 Mock 时应抛出错误', async () => {
      disableMock()
      
      await expect(mockRequest.get('/test')).rejects.toThrow('Mock is disabled')
      
      enableMock() // 恢复
    })

    it('应统计请求次数', async () => {
      expect(getMockRequestCount()).toBe(0)
      
      await mockGet('/api/machinery/list')
      expect(getMockRequestCount()).toBe(1)
      
      await mockPost('/api/machinery', { name: 'test' })
      expect(getMockRequestCount()).toBe(2)
      
      resetMockCount()
      expect(getMockRequestCount()).toBe(0)
    })
  })

  describe('HTTP 方法测试', () => {
    it('GET 请求应返回 Mock 数据', async () => {
      const response = await mockGet('/api/machinery/list')
      
      expect(response.status).toBe(200)
      expect(response.data).toBeDefined()
      expect(response.data.code).toBe(200)
    })

    it('POST 请求应处理数据', async () => {
      const postData = { name: '测试机器', type: '拖拉机' }
      const response = await mockPost('/api/machinery', postData)
      
      expect(response.data).toBeDefined()
      expect(response.data.data).toMatchObject(postData)
    })

    it('PUT 请求应更新数据', async () => {
      const updateData = { name: '更新后的名称' }
      const response = await mockPut('/farm/car/status', updateData)
      
      expect(response.status).toBe(200)
    })

    it('DELETE 请求应删除数据', async () => {
      const response = await mockDelete('/farm/farm-base/delete?id=123')
      
      expect(response.status).toBe(200)
    })
  })

  describe('响应结构', () => {
    it('响应应包含完整的 axios 结构', async () => {
      const response = await mockGet('/api/machinery/list')
      
      expect(response).toHaveProperty('data')
      expect(response).toHaveProperty('status')
      expect(response).toHaveProperty('statusText')
      expect(response).toHaveProperty('headers')
      expect(response).toHaveProperty('config')
    })

    it('响应数据应包含标准 code', async () => {
      const response = await mockGet('/api/machinery/list')
      
      expect(response.data).toHaveProperty('code')
      expect([200, 404]).toContain(response.data.code)
    })
  })

  describe('URL 参数解析', () => {
    it('应正确解析 URL 查询参数', async () => {
      const response = await mockGet('/api/machinery/list?page=2&size=20')
      
      expect(response.status).toBe(200)
    })

    it('未匹配的 URL 应返回 404', async () => {
      const response = await mockGet('/api/unknown/endpoint')
      
      expect(response.status).toBe(404)
      expect(response.data.code).toBe(404)
    })
  })

  describe('延迟模拟', () => {
    it('请求应有延迟', async () => {
      const startTime = Date.now()
      await mockGet('/api/machinery/list')
      const endTime = Date.now()
      
      // Mock 延迟在 100-500ms 之间
      expect(endTime - startTime).toBeGreaterThanOrEqual(50)
    })
  })

  describe('真实 API 路径测试', () => {
    it('应支持 /farm/car/new/list 路径', async () => {
      const response = await mockPost('/farm/car/new/list', { pageNum: 1, pageSize: 10 })
      
      expect(response.status).toBe(200)
      expect(response.data.data).toHaveProperty('list')
      expect(response.data.data).toHaveProperty('total')
    })

    it('应支持 /farm/car/new/detail 路径', async () => {
      const response = await mockGet('/farm/car/new/detail?carId=123&type=0')
      
      expect(response.status).toBe(200)
      expect(response.data.data).toHaveProperty('carId')
    })

    it('应支持 /auth/oauth/token 登录路径', async () => {
      const response = await mockPost('/auth/oauth/token', { 
        username: 'admin', 
        password: 'admin123',
        grant_type: 'password'
      })
      
      expect(response.status).toBe(200)
      expect(response.data.data).toHaveProperty('access_token')
      expect(response.data.data).toHaveProperty('refresh_token')
    })
  })
})
