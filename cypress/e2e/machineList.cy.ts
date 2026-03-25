describe('机器列表页面测试', () => {
  beforeEach(() => {
    // 假设有登录自定义命令
    // cy.login()
    cy.visit('/#/machineryList')
    cy.waitForTableLoad()
  })

  it('应加载并显示机器列表', () => {
    // 验证页面标题
    cy.get('.app_container').should('exist')
    
    // 验证表格存在
    cy.get('.el-table').should('exist')
  })

  it('搜索功能应正常工作', () => {
    const searchKeyword = '测试'
    
    // 使用搜索命令
    cy.searchTable(searchKeyword)
    
    // 验证搜索结果
    cy.get('.el-table__body').then(($body) => {
      if ($body.find('tr').length > 0) {
        cy.get('.el-table__body tr').should('contain', searchKeyword)
      } else {
        cy.get('.el-empty').should('exist')
      }
    })
  })

  it('分页功能应正常工作', () => {
    // 检查分页组件存在
    cy.get('.el-pagination').should('exist')
    
    // 如果有下一页按钮，测试翻页
    cy.get('body').then(($body) => {
      const $nextBtn = $body.find('.btn-next:not(:disabled)')
      if ($nextBtn.length > 0) {
        // 获取当前页码
        cy.get('.el-pager .number.active').invoke('text').as('currentPage')
        
        // 点击下一页
        cy.get('.btn-next').click()
        
        // 验证页码改变
        cy.get('.el-pager .number.active').should('not.have.text', '@currentPage')
      }
    })
  })

  it('刷新按钮应重新加载数据', () => {
    // 查找刷新按钮并点击
    cy.get('button').contains(/刷新|Refresh/).first().click()
    
    // 验证加载状态
    cy.get('.el-loading-mask').should('exist')
    cy.waitForTableLoad()
    
    // 验证数据已加载
    cy.get('.el-table').should('exist')
  })
})
