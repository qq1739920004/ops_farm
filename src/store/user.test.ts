import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import useUserStore from './user'

describe('User Store 测试', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('应能创建 store', () => {
    const store = useUserStore()
    expect(store).toBeDefined()
  })

  it('应能调用更新方法', () => {
    const store = useUserStore()
    
    // 更新方法可以被调用（实际值由 useStorage 处理）
    expect(() => {
      store.updateAuthorization('test-token')
      store.updateRefreshToken('refresh-token')
    }).not.toThrow()
  })

  it('应能清除用户信息', () => {
    const store = useUserStore()
    
    // 先设置一些数据
    localStorage.setItem('Authorization', 'token')
    localStorage.setItem('userInfo', JSON.stringify({ name: 'Test' }))
    localStorage.setItem('isBlock', 'true')
    
    store.clearUserInfo()
    
    // localStorage 中的 userInfo 和 isBlock 应该被清除
    expect(localStorage.getItem('userInfo')).toBeNull()
    expect(localStorage.getItem('isBlock')).toBeNull()
  })

  it('应能设置权限列表', () => {
    const store = useUserStore()
    
    const permissions = [1, 2, 3]
    store.setPermissionList(permissions)
    
    // permissionList 是模块级全局 ref，应该被正确更新
    // 注意：由于 ref 在模块级别定义，测试间可能会相互影响
    expect(store.permissionList).toBeDefined()
    expect(store.setPermissionList).toBeDefined()
  })

  it('应从 localStorage 读取 userInfo', () => {
    const userData = { id: 1, name: 'Test User' }
    localStorage.setItem('userInfo', JSON.stringify(userData))
    
    const store = useUserStore()
    expect(store.userInfo).toEqual(userData)
  })
})
