import { useI18n } from 'vue-i18n'

/**
 * 字典映射工具
 * 根据字典类型和bizKey获取对应的国际化翻译
 */
export function useDictMapping() {
  const { t } = useI18n()

  /**
   * 车辆类型映射
   */
  const vehicleTypeMapping: Record<string, string> = {
    '1': 'dictMapping.vehicleType1',
    '2': 'dictMapping.vehicleType2', 
    '3': 'dictMapping.vehicleType3',
    '4': 'dictMapping.vehicleType4',
    '-1': 'dictMapping.vehicleTypeMinus1'
  }

  /**
   * 作业类型映射
   */
  const workCategoryMapping: Record<string, string> = {
    '0': 'dictMapping.workCategory0',
    '1': 'dictMapping.workCategory1',
    '2': 'dictMapping.workCategory2',
    '3': 'dictMapping.workCategory3',
    '4': 'dictMapping.workCategory4',
    '5': 'dictMapping.workCategory5',
    '6': 'dictMapping.workCategory6',
    '7': 'dictMapping.workCategory7',
    '8': 'dictMapping.workCategory8',
    '9': 'dictMapping.workCategory9',
    '10': 'dictMapping.workCategory10',
    '11': 'dictMapping.workCategory11',
    '12': 'dictMapping.workCategory12'
  }

  /**
   * 根据字典类型和bizKey获取翻译
   * @param dictType 字典类型，如 'vehicle_type'
   * @param bizKey 业务键值
   * @returns 翻译后的文本
   */
  const getDictTranslation = (dictType: string, bizKey: string): string => {
    switch (dictType) {
      case 'vehicle_type':
        return vehicleTypeMapping[bizKey] ? t(vehicleTypeMapping[bizKey]) : bizKey
      case 'work_category':
        return workCategoryMapping[bizKey] ? t(workCategoryMapping[bizKey]) : bizKey
      default:
        return bizKey
    }
  }

  /**
   * 处理字典数据数组，将bizValue替换为对应的翻译
   * @param dictList 字典数据数组
   * @returns 处理后的数组
   */
  const transformDictList = (dictList: any[]): any[] => {
    return dictList.map(item => ({
      ...item,
      bizValueTranslated: getDictTranslation(item.dicKey, item.bizKey),
      // 保留原始的bizValue以备需要
      originalBizValue: item.bizValue
    }))
  }

  /**
   * 根据字典数据获取选项列表（用于下拉框等）
   * @param dictList 字典数据数组
   * @returns 选项列表 {label, value}
   */
  const getDictOptions = (dictList: any[]): Array<{label: string, value: string}> => {
    return dictList.map(item => ({
      label: getDictTranslation(item.dicKey, item.bizKey),
      value: item.bizKey
    }))
  }

  return {
    getDictTranslation,
    transformDictList,
    getDictOptions
  }
}

/**
 * 静态方法，不依赖于组件上下文
 */
export class DictMappingStatic {
  /**
   * 车辆类型映射（静态）
   */
  private static vehicleTypeMap: Record<string, Record<string, string>> = {
    zh: {
      '1': '拖拉机',
      '2': '插秧机',
      '3': '植保机',
      '4': '收割机',
      '-1': '其他'
    },
    en: {
      '1': 'Tractor',
      '2': 'Rice Transplanter',
      '3': 'Sprayer',
      '4': 'Harvester',
      '-1': 'Others'
    },
    jp: {
      '1': 'トラクター',
      '2': '田植え機',
      '3': '散布機',
      '4': '収穫機',
      '-1': 'その他'
    }
  }

  /**
   * 作业类型映射（静态）
   */
  private static workCategoryMap: Record<string, Record<string, string>> = {
    zh: {
      '0': '播种', '1': '犁地', '2': '耙地', '3': '旋耕', '4': '播种',
      '5': '插秧', '6': '栽苗', '7': '喷药', '8': '施肥', '9': '除草',
      '10': '松土', '11': '收获', '12': '其他'
    },
    en: {
      '0': 'Seeding', '1': 'Plowing', '2': 'Harrowing', '3': 'Rotary Tillage', '4': 'Seeding',
      '5': 'Rice Transplanting', '6': 'Seedling Planting', '7': 'Spraying', '8': 'Fertilizing', '9': 'Weeding',
      '10': 'Soil Loosening', '11': 'Harvesting', '12': 'Others'
    },
    jp: {
      '0': '播種', '1': '耕起', '2': 'ハロー', '3': 'ロータリー', '4': '播種',
      '5': '田植え', '6': '苗植え', '7': '散布', '8': '施肥', '9': '除草',
      '10': '中耕', '11': '収穫', '12': 'その他'
    }
  }

  /**
   * 获取字典翻译（静态方法）
   * @param dictType 字典类型
   * @param bizKey 业务键值
   * @param locale 语言环境
   * @returns 翻译文本
   */
  static getDictTranslation(dictType: string, bizKey: string, locale: string = 'zh'): string {
    switch (dictType) {
      case 'vehicle_type':
        return this.vehicleTypeMap[locale]?.[bizKey] || bizKey
      case 'work_category':
        return this.workCategoryMap[locale]?.[bizKey] || bizKey
      default:
        return bizKey
    }
  }

  /**
   * 处理字典数据数组（静态方法）
   * @param dictList 字典数据数组
   * @param locale 语言环境
   * @returns 处理后的数组
   */
  static transformDictList(dictList: any[], locale: string = 'zh'): any[] {
    return dictList.map(item => ({
      ...item,
      bizValueTranslated: this.getDictTranslation(item.dicKey, item.bizKey, locale),
      originalBizValue: item.bizValue
    }))
  }

  /**
   * 获取选项列表（静态方法）
   * @param dictList 字典数据数组
   * @param locale 语言环境
   * @returns 选项列表
   */
  static getDictOptions(dictList: any[], locale: string = 'zh'): Array<{label: string, value: string}> {
    return dictList.map(item => ({
      label: this.getDictTranslation(item.dicKey, item.bizKey, locale),
      value: item.bizKey
    }))
  }
}
