describe('登录页面测试', () => {
  beforeEach(() => {
    cy.visit('/#/login')
  })

  it('应正确加载登录页面', () => {
    cy.get('input[name="username"]').should('exist')
    cy.get('input[name="password"]').should('exist')
    cy.get('button[type="submit"]').should('exist')
  })

  it('空表单提交应显示验证错误', () => {
    cy.get('button[type="submit"]').click()
    
    // Element Plus 表单验证错误提示
    cy.get('.el-form-item__error').should('be.visible')
  })

  it('错误凭据应显示错误消息', () => {
    cy.get('input[name="username"]').type('wronguser')
    cy.get('input[name="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    
    // 等待错误消息
    cy.get('.el-message--error, .el-message--warning', { timeout: 5000 }).should('be.visible')
  })

  it('成功登录后应跳转到主页', () => {
    // 注意：这里的凭据需要根据实际情况修改
    cy.get('input[name="username"]').type('admin')
    cy.get('input[name="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    
    // 验证登录成功后跳转
    cy.url({ timeout: 10000 }).should('not.include', '/login')
  })
})
