// Cypress E2E 支持文件
// 在这里添加全局配置和自定义命令

// 导入认证相关命令
import './auth'

// 自定义登录命令
declare global {
  namespace Cypress {
    interface Chainable {
      /** 使用真实凭据登录（需要配置正确的用户名密码） */
      login(): Chainable<void>
      /** 退出登录 */
      logout(): Chainable<void>
      /** 注入 Mock Token 直接登录（推荐用于跨系统 Token 场景） */
      mockLogin(): Chainable<void>
      /** 使用 API Mock 方式登录 */
      apiMockLogin(): Chainable<void>
      /** 清除认证信息 */
      clearAuth(): Chainable<void>
      /** 拦截所有 API 并返回 Mock 数据 */
      mockAPIs(): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', () => {
  // 这里假设有一个登录页面
  cy.visit('/#/login')
  cy.get('input[name="username"]', { timeout: 10000 }).should('exist')
  cy.get('input[name="username"]').type('admin')
  cy.get('input[name="password"]').type('password')
  cy.get('button[type="submit"]').click()
  
  // 等待登录完成，URL 应该改变
  cy.url().should('not.include', '/login')
})

Cypress.Commands.add('logout', () => {
  // 清除 localStorage 中的认证信息
  cy.window().then((win) => {
    win.localStorage.removeItem('Authorization')
    win.localStorage.removeItem('refresh_token')
    win.localStorage.removeItem('userInfo')
  })
  cy.visit('/#/login')
})

// 全局错误处理
Cypress.on('uncaught:exception', (err, runnable) => {
  // 防止某些第三方库的错误中断测试
  console.log('Uncaught exception:', err.message)
  return false
})

// 测试失败时截图
Cypress.on('fail', (error, runnable) => {
  cy.screenshot(`fail-${Date.now()}`)
  throw error
})
