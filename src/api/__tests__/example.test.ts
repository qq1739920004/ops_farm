import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import mockRequest, { enableMock, disableMock } from '@/utils/request.mock'

/**
 * API 测试示例
 * 展示如何使用 Mock 来测试 API 调用
 */

describe('API Mock 测试示例', () => {
  beforeAll(() => {
    enableMock()
  })

  afterAll(() => {
    disableMock()
  })

  it('Mock GET 请求应返回数据', async () => {
    const response = await mockRequest.get('/api/machinery/list')
    
    expect(response.status).toBe(200)
    expect(response.data.code).toBe(200)
    expect(response.data.data).toBeDefined()
  })

  it('Mock POST 请求应处理数据', async () => {
    const data = { name: '测试机器', type: '拖拉机' }
    const response = await mockRequest.post('/api/machinery', data)
    
    expect(response.status).toBe(200)
    expect(response.data.data).toMatchObject(data)
  })

  it('应支持真实项目 API 路径', async () => {
    // 机器列表 API
    const listResponse = await mockRequest.post('/farm/car/new/list', {
      pageNum: 1,
      pageSize: 10
    })
    expect(listResponse.status).toBe(200)
    expect(listResponse.data.data.list).toBeInstanceOf(Array)
    
    // 机器详情 API
    const detailResponse = await mockRequest.get('/farm/car/new/detail?carId=123&type=0')
    expect(detailResponse.status).toBe(200)
    expect(detailResponse.data.data).toHaveProperty('carId')
    
    // 经销商列表 API
    const dealerResponse = await mockRequest.get('/farm/car/dealer')
    expect(dealerResponse.status).toBe(200)
    expect(dealerResponse.data.data).toBeInstanceOf(Array)
    
    // 登录 API
    const loginResponse = await mockRequest.post('/auth/oauth/token', {
      username: 'admin',
      password: 'password',
      grant_type: 'password'
    })
    expect(loginResponse.status).toBe(200)
    expect(loginResponse.data.data).toHaveProperty('access_token')
  })

  it('未匹配的 URL 应返回 404', async () => {
    const response = await mockRequest.get('/api/unknown')
    expect(response.status).toBe(404)
  })
})
