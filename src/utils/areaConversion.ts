import { useI18n } from 'vue-i18n'

/**
 * 面积单位转换工具
 * 中文环境：显示亩
 * 英文环境：转换为公顷显示
 * 1亩 = 0.0667公顷
 */
export function useAreaConversion() {
  const { locale, t } = useI18n()

  /**
   * 转换面积数值（从亩转换为当前语言环境对应的单位）
   * @param muValue 亩值
   * @returns 转换后的数值
   */
  const convertAreaValue = (muValue: number | string): number => {
    const numValue = Number(muValue)
    if (isNaN(numValue)) return 0
    
    // 如果是英文或日文环境，转换为公顷
    if (locale.value === 'en' || locale.value === 'jp') {
      return numValue * 0.0667 // 1亩 = 0.0667公顷
    }
    
    // 中文环境保持原值（亩）
    return numValue
  }

  /**
   * 获取面积单位文本
   * @returns 单位文本
   */
  const getAreaUnit = (): string => {
    return t('work.mu')
  }

  /**
   * 格式化面积显示（包含数值转换和单位）
   * @param muValue 亩值
   * @param decimalPlaces 小数位数，默认2位
   * @returns 格式化后的字符串
   */
  const formatArea = (muValue: number | string, decimalPlaces: number = 2): string => {
    const convertedValue = convertAreaValue(muValue)
    const unit = getAreaUnit()
    return `${convertedValue.toFixed(decimalPlaces)}${unit}`
  }

  /**
   * 格式化面积显示（只返回数值部分，用于需要单独处理单位的场景）
   * @param muValue 亩值
   * @param decimalPlaces 小数位数，默认2位
   * @returns 格式化后的数值字符串
   */
  const formatAreaValue = (muValue: number | string, decimalPlaces: number = 2): string => {
    const convertedValue = convertAreaValue(muValue)
    return convertedValue.toFixed(decimalPlaces)
  }

  return {
    convertAreaValue,
    getAreaUnit,
    formatArea,
    formatAreaValue
  }
}

/**
 * 静态版本的面积转换工具（不依赖Vue上下文）
 */
export class AreaConversionStatic {
  /**
   * 转换面积数值
   * @param muValue 亩值
   * @param locale 语言环境
   * @returns 转换后的数值
   */
  static convertAreaValue(muValue: number | string, locale: string = 'zh'): number {
    const numValue = Number(muValue)
    if (isNaN(numValue)) return 0
    
    if (locale === 'en' || locale === 'jp') {
      return numValue * 0.0667 // 转换为公顷
    }
    
    return numValue // 保持亩
  }

  /**
   * 获取面积单位
   * @param locale 语言环境
   * @returns 单位文本
   */
  static getAreaUnit(locale: string = 'zh'): string {
    const units: Record<string, string> = {
      zh: '亩',
      en: 'ha', // hectare缩写
      jp: '亩'  // 日文保持亩
    }
    return units[locale] || units.zh
  }

  /**
   * 格式化面积显示
   * @param muValue 亩值
   * @param locale 语言环境
   * @param decimalPlaces 小数位数
   * @returns 格式化后的字符串
   */
  static formatArea(muValue: number | string, locale: string = 'zh', decimalPlaces: number = 2): string {
    const convertedValue = this.convertAreaValue(muValue, locale)
    const unit = this.getAreaUnit(locale)
    return `${convertedValue.toFixed(decimalPlaces)}${unit}`
  }
}
