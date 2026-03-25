// 自定义 Cypress 命令

// 等待 Element Plus 组件加载
Cypress.Commands.add('waitForElementPlus', () => {
  cy.get('.el-loading-mask', { timeout: 10000 }).should('not.exist')
})

// 等待表格数据加载
Cypress.Commands.add('waitForTableLoad', () => {
  cy.get('.el-table__body tr', { timeout: 10000 }).should('have.length.at.least', 0)
  cy.get('.el-loading-mask', { timeout: 10000 }).should('not.exist')
})

// 搜索表格数据
Cypress.Commands.add('searchTable', (keyword: string) => {
  cy.get('input[placeholder*="搜索"], input[placeholder*="Search"]').first()
    .clear()
    .type(keyword)
  cy.get('button').contains(/搜索|Search|查询/).first().click()
  cy.waitForTableLoad()
})
