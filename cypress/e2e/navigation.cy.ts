describe('导航菜单测试', () => {
  beforeEach(() => {
    // 登录并访问主页
    // cy.login()
    cy.visit('/#/')
  })

  it('侧边栏导航应正确显示', () => {
    // 验证侧边栏存在
    cy.get('.sidebar-container, .el-menu').should('exist')
    
    // 验证主要导航项存在
    cy.get('.el-menu-item, .el-sub-menu').should('have.length.at.least', 1)
  })

  it('点击导航项应跳转到对应页面', () => {
    // 查找机器列表导航项并点击
    cy.get('.el-menu-item, .el-sub-menu__title')
      .contains(/机器|设备|Machinery/)
      .click({ force: true })
    
    // 验证 URL 变化
    cy.url().should('include', 'machinery')
  })

  it('子菜单应能展开和收起', () => {
    // 查找有子菜单的项
    cy.get('.el-sub-menu').first().then(($submenu) => {
      // 点击展开
      cy.wrap($submenu).find('.el-sub-menu__title').click()
      
      // 验证子菜单展开
      cy.wrap($submenu).should('have.class', 'is-opened')
      
      // 再次点击收起
      cy.wrap($submenu).find('.el-sub-menu__title').click()
      
      // 验证子菜单收起
      cy.wrap($submenu).should('not.have.class', 'is-opened')
    })
  })
})
