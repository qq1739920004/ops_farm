/**
 * 使用 Mock Token 的登录测试
 * 适用于跨系统 Token 场景
 */

describe('Mock Token 登录测试', () => {
  beforeEach(() => {
    // 清除之前的认证
    cy.clearAuth()
  })

  it('通过注入 Mock Token 直接访问受保护页面', () => {
    // 注入 Mock Token
    cy.mockLogin()
    
    // 访问需要登录的页面
    cy.visit('/#/machineryList')
    
    // 验证页面加载成功（没有跳转到登录页）
    cy.url().should('not.include', '/login')
    cy.get('.app_container').should('exist')
  })

  it('未登录时应跳转到登录页', () => {
    // 确保没有 Token
    cy.clearAuth()
    
    // 访问受保护页面
    cy.visit('/#/machineryList')
    
    // 应该被重定向到登录页
    cy.url({ timeout: 10000 }).should('include', '/login')
  })

  it('使用 API Mock 方式登录', () => {
    // 设置 API 拦截
    cy.mockAPIs()
    
    // 使用 API Mock 登录
    cy.apiMockLogin()
    
    // 访问机器列表页
    cy.visit('/#/machineryList')
    
    // 等待 API 响应
    cy.wait('@carList')
    
    // 验证页面显示
    cy.get('.el-table').should('exist')
  })
})

describe('Mock API 数据测试', () => {
  beforeEach(() => {
    // 注入 Token
    cy.mockLogin()
    // 设置 API 拦截
    cy.mockAPIs()
  })

  it('应显示 Mock 的机器列表数据', () => {
    cy.visit('/#/machineryList')
    cy.wait('@carList')
    
    // 验证 Mock 数据被正确显示
    cy.get('.el-table__body').should('contain', '测试机器1')
    cy.get('.el-table__body').should('contain', 'SINOTEST001')
  })

  it('应能查看机器详情', () => {
    cy.visit('/#/machineryList')
    cy.wait('@carList')
    
    // 点击第一个机器的查看按钮（根据实际情况调整选择器）
    cy.get('.el-table__body tr').first().within(() => {
      cy.get('button').contains('查看').click()
    })
    
    cy.wait('@carDetail')
    
    // 验证详情显示
    cy.get('.app_container').should('contain', '测试机器1')
  })
})
