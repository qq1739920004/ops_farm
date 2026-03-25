import { describe, it, expect, vi } from 'vitest'
import { AreaConversionStatic } from './areaConversion'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: { value: 'zh' },
    t: (key: string) => key
  })
}))

describe('AreaConversionStatic 面积转换工具测试', () => {
  describe('convertAreaValue', () => {
    it('中文环境应返回原始亩值', () => {
      expect(AreaConversionStatic.convertAreaValue(10, 'zh')).toBe(10)
      expect(AreaConversionStatic.convertAreaValue(100, 'zh')).toBe(100)
    })

    it('英文环境应将亩转换为公顷 (1亩 = 0.0667公顷)', () => {
      expect(AreaConversionStatic.convertAreaValue(10, 'en')).toBeCloseTo(0.667, 3)
      expect(AreaConversionStatic.convertAreaValue(100, 'en')).toBeCloseTo(6.67, 2)
    })

    it('日文环境应将亩转换为公顷', () => {
      expect(AreaConversionStatic.convertAreaValue(15, 'jp')).toBeCloseTo(1.0005, 3)
    })

    it('非法数值应返回 0', () => {
      expect(AreaConversionStatic.convertAreaValue(NaN, 'zh')).toBe(0)
      expect(AreaConversionStatic.convertAreaValue('invalid', 'zh')).toBe(0)
    })

    it('字符串数字应正确转换', () => {
      expect(AreaConversionStatic.convertAreaValue('50', 'zh')).toBe(50)
      expect(AreaConversionStatic.convertAreaValue('50', 'en')).toBeCloseTo(3.335, 3)
    })

    it('默认使用中文环境', () => {
      expect(AreaConversionStatic.convertAreaValue(20)).toBe(20)
    })
  })

  describe('getAreaUnit', () => {
    it('中文环境应返回 "亩"', () => {
      expect(AreaConversionStatic.getAreaUnit('zh')).toBe('亩')
    })

    it('英文环境应返回 "ha"', () => {
      expect(AreaConversionStatic.getAreaUnit('en')).toBe('ha')
    })

    it('日文环境应返回 "亩"', () => {
      expect(AreaConversionStatic.getAreaUnit('jp')).toBe('亩')
    })

    it('未知环境应默认返回 "亩"', () => {
      expect(AreaConversionStatic.getAreaUnit('unknown')).toBe('亩')
    })

    it('默认使用中文环境', () => {
      expect(AreaConversionStatic.getAreaUnit()).toBe('亩')
    })
  })

  describe('formatArea', () => {
    it('应正确格式化面积显示（中文）', () => {
      expect(AreaConversionStatic.formatArea(10.567, 'zh', 2)).toBe('10.57亩')
    })

    it('应正确格式化面积显示（英文）', () => {
      expect(AreaConversionStatic.formatArea(15, 'en', 2)).toBe('1.00ha')
    })

    it('应支持自定义小数位数', () => {
      expect(AreaConversionStatic.formatArea(10.567, 'zh', 1)).toBe('10.6亩')
      expect(AreaConversionStatic.formatArea(10.567, 'zh', 0)).toBe('11亩')
    })

    it('非法数值应显示为 0', () => {
      expect(AreaConversionStatic.formatArea(NaN, 'zh')).toBe('0.00亩')
    })
  })
})
