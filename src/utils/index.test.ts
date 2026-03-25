import { describe, it, expect } from 'vitest'
import { hasClass, addClass, removeClass, isExternal } from './index'

describe('DOM 工具函数测试', () => {
  describe('hasClass', () => {
    it('应该正确检测元素是否包含指定类名', () => {
      const div = document.createElement('div')
      div.className = 'test-class another-class'
      
      expect(hasClass(div, 'test-class')).toBe(true)
      expect(hasClass(div, 'another-class')).toBe(true)
      expect(hasClass(div, 'non-existent')).toBe(false)
    })

    it('空类名应该返回 false', () => {
      const div = document.createElement('div')
      expect(hasClass(div, 'any-class')).toBe(false)
    })
  })

  describe('addClass', () => {
    it('应该为元素添加新类名', () => {
      const div = document.createElement('div')
      addClass(div, 'new-class')
      
      expect(div.className).toContain('new-class')
    })

    it('不应该添加重复的类名', () => {
      const div = document.createElement('div')
      div.className = 'existing-class'
      addClass(div, 'existing-class')
      
      // 类名不应该重复出现
      const matches = div.className.match(/existing-class/g)
      expect(matches?.length).toBe(1)
    })
  })

  describe('removeClass', () => {
    it('应该从元素中移除指定类名', () => {
      const div = document.createElement('div')
      div.className = 'class-to-remove other-class'
      removeClass(div, 'class-to-remove')
      
      expect(div.className).not.toContain('class-to-remove')
      expect(div.className).toContain('other-class')
    })

    it('移除不存在的类名不应该报错', () => {
      const div = document.createElement('div')
      div.className = 'some-class'
      
      expect(() => removeClass(div, 'non-existent')).not.toThrow()
      expect(div.className).toBe('some-class')
    })
  })
})

describe('URL 工具函数测试', () => {
  describe('isExternal', () => {
    it('应该正确识别外部链接', () => {
      expect(isExternal('https://example.com')).toBe(true)
      expect(isExternal('http://example.com')).toBe(true)
      expect(isExternal('mailto:test@test.com')).toBe(true)
      expect(isExternal('tel:123456789')).toBe(true)
    })

    it('应该正确识别内部链接', () => {
      expect(isExternal('/local/path')).toBe(false)
      expect(isExternal('./relative/path')).toBe(false)
      expect(isExternal('page.html')).toBe(false)
    })

    it('应该处理空字符串', () => {
      expect(isExternal('')).toBe(false)
    })
  })
})
