// Cypress 认证辅助函数
// 用于处理跨系统 Token 问题

// Mock Token 数据
const MOCK_TOKEN = {
  access_token: 'mock-access-token-for-cypress-test',
  refresh_token: 'mock-refresh-token-for-cypress-test',
  token_type: 'bearer',
  expires_in: 7200
}

const MOCK_USER_INFO = {
  id: 1,
  username: 'cypress-test',
  name: 'Cypress 测试用户',
  role: 'admin',
  permissions: [1, 2, 3, 4, 5]
}

/**
 * 注入 Mock Token 到 localStorage
 * 这是最快速的方式，跳过所有登录流程
 */
export const injectMockToken = () => {
  cy.window().then((win) => {
    // 设置 Authorization
    win.localStorage.setItem('Authorization', `bearer ${MOCK_TOKEN.access_token}`)
    win.localStorage.setItem('refresh_token', MOCK_TOKEN.refresh_token)
    win.localStorage.setItem('userInfo', JSON.stringify(MOCK_USER_INFO))
  })
  
  cy.log('已注入 Mock Token')
}

/**
 * 拦截登录 API 并返回 Mock 数据
 * 这种方式更接近真实场景
 */
export const mockLoginAPI = () => {
  cy.intercept('POST', '**/auth/oauth/token', {
    statusCode: 200,
    body: {
      code: 200,
      data: {
        ...MOCK_TOKEN,
        userInfo: MOCK_USER_INFO
      },
      message: 'success'
    }
  }).as('loginRequest')
}

/**
 * 拦截用户信息 API
 */
export const mockUserInfoAPI = () => {
  cy.intercept('GET', '**/api/user/info', {
    statusCode: 200,
    body: {
      code: 200,
      data: MOCK_USER_INFO,
      message: 'success'
    }
  }).as('userInfoRequest')
}

/**
 * 拦截所有 API 请求并添加 Mock Token 响应
 */
export const mockAllAPIs = () => {
  // 机器列表
  cy.intercept('POST', '**/farm/car/new/list', {
    statusCode: 200,
    body: {
      code: 200,
      data: {
        list: [
          { id: 1, sn: 'SINOTEST001', carName: '测试机器1', status: 1 },
          { id: 2, sn: 'SINOTEST002', carName: '测试机器2', status: 0 },
          { id: 3, sn: 'SINOTEST003', carName: '测试机器3', status: 1 }
        ],
        total: 3,
        page: 1,
        size: 10
      }
    }
  }).as('carList')
  
  // 机器详情
  cy.intercept('GET', '**/farm/car/new/detail*', {
    statusCode: 200,
    body: {
      code: 200,
      data: {
        id: 1,
        sn: 'SINOTEST001',
        carName: '测试机器1',
        status: 1,
        terminalType: 'T30',
        lat: 31.2304,
        lng: 121.4737
      }
    }
  }).as('carDetail')
  
  // 经销商列表
  cy.intercept('GET', '**/farm/car/dealer', {
    statusCode: 200,
    body: {
      code: 200,
      data: [
        { id: 1, name: '测试经销商1', contact: '张经理' },
        { id: 2, name: '测试经销商2', contact: '李经理' }
      ]
    }
  }).as('dealerList')
}

/**
 * 清除认证信息
 */
export const clearAuth = () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('Authorization')
    win.localStorage.removeItem('refresh_token')
    win.localStorage.removeItem('userInfo')
  })
}

// 声明全局命令
declare global {
  namespace Cypress {
    interface Chainable {
      /** 注入 Mock Token 直接登录 */
      mockLogin(): Chainable<void>
      /** 使用 API 拦截方式登录 */
      apiMockLogin(): Chainable<void>
      /** 清除认证 */
      clearAuth(): Chainable<void>
      /** 拦截所有 API */
      mockAPIs(): Chainable<void>
    }
  }
}

// 注册自定义命令
Cypress.Commands.add('mockLogin', () => {
  injectMockToken()
})

Cypress.Commands.add('apiMockLogin', () => {
  mockLoginAPI()
  mockUserInfoAPI()
  
  cy.visit('/#/login')
  cy.get('input[name="username"]', { timeout: 10000 }).should('exist')
  cy.get('input[name="username"]').type('admin')
  cy.get('input[name="password"]').type('password')
  cy.get('button[type="submit"]').click()
  
  cy.wait('@loginRequest')
  cy.url().should('not.include', '/login')
})

Cypress.Commands.add('clearAuth', () => {
  clearAuth()
})

Cypress.Commands.add('mockAPIs', () => {
  mockAllAPIs()
})
