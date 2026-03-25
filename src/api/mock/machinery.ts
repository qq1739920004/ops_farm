/**
 * 机器列表相关 API Mock
 * 匹配真实的 API 端点
 */

import { createMockResponse, mockDelay } from './index'

// 生成随机机器数据
const generateMachineList = (page: number = 1, size: number = 10) => {
  const total = 87
  const list = Array(size).fill(null).map((_, index) => {
    const id = (page - 1) * size + index + 1
    return {
      id,
      carId: id,
      sn: `SINO${String(Math.random()).slice(2, 10).toUpperCase()}`,
      carName: `农机${id}号`,
      terminalType: ['T20', 'T30', 'T50'][Math.floor(Math.random() * 3)],
      dealerName: `经销商${Math.floor(Math.random() * 5) + 1}`,
      dealerId: Math.floor(Math.random() * 5) + 1,
      createTime: '2024-01-15 10:30:00',
      status: Math.random() > 0.3 ? 1 : 0, // 1:在线, 0:离线
      voltage: Math.floor(Math.random() * 4),
      commuMode: Math.floor(Math.random() * 3) + 1,
      netSignal: Math.floor(Math.random() * 5) + 1,
      health: Math.floor(Math.random() * 9),
      // 位置信息
      lat: 30.0 + Math.random() * 10,
      lng: 110.0 + Math.random() * 20,
      // 作业信息
      workArea: Math.floor(Math.random() * 500) / 10,
      workTime: Math.floor(Math.random() * 1000),
      mileage: Math.floor(Math.random() * 5000),
      // 软件信息
      softVersion: `V${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      // 机主信息
      ownerName: `用户${Math.floor(Math.random() * 50) + 1}`,
      ownerPhone: `138${String(Math.random()).slice(2, 11)}`,
      // 其他字段
      model: ['拖拉机', '收割机', '插秧机', '植保机'][Math.floor(Math.random() * 4)],
      bindTime: '2024-01-10 08:00:00',
      expireTime: '2025-01-10 08:00:00',
      isStarBase: Math.random() > 0.5,
      isLogUpload: Math.random() > 0.5,
    }
  }).filter(item => item.id <= total)

  return { list, total, page, size }
}

// 生成机器详情
const generateMachineDetail = (carId: number) => ({
  id: carId,
  carId,
  sn: `SINO${String(Math.random()).slice(2, 10).toUpperCase()}`,
  carName: `农机${carId}号`,
  terminalType: 'T30',
  model: '拖拉机',
  dealerName: '测试经销商',
  dealerId: 1,
  ownerName: '测试用户',
  ownerPhone: '13800138000',
  createTime: '2024-01-15 10:30:00',
  bindTime: '2024-01-10 08:00:00',
  status: 1,
  voltage: 2,
  commuMode: 1,
  netSignal: 4,
  health: 7,
  lat: 31.2304,
  lng: 121.4737,
  softVersion: 'V2.5.1',
  hardwareVersion: 'V1.0',
  workArea: 156.5,
  workTime: 450,
  mileage: 3200,
  isStarBase: true,
  isLogUpload: false,
  // 扩展信息
  extendInfo: {
    engineStatus: '正常',
    fuelLevel: 85,
    batteryVoltage: 12.6,
    lastOnlineTime: '2024-03-24 15:30:00'
  }
})

// 经销商列表
const dealerList = [
  { id: 1, name: '华东经销商', contact: '张经理', phone: '13800138001' },
  { id: 2, name: '华北经销商', contact: '李经理', phone: '13800138002' },
  { id: 3, name: '华南经销商', contact: '王经理', phone: '13800138003' },
  { id: 4, name: '西南经销商', contact: '赵经理', phone: '13800138004' },
  { id: 5, name: '西北经销商', contact: '刘经理', phone: '13800138005' },
]

// 终端类型列表
const terminalTypes = [
  { id: 1, type: 'T20', name: 'T20智能终端', description: '基础版' },
  { id: 2, type: 'T30', name: 'T30智能终端', description: '标准版' },
  { id: 3, type: 'T50', name: 'T50智能终端', description: '高级版' },
]

// 软件版本列表
const softVersions = [
  { id: 1, version: 'V2.5.1', releaseDate: '2024-02-01', description: '优化定位精度' },
  { id: 2, version: 'V2.5.0', releaseDate: '2024-01-15', description: '新增星基功能' },
  { id: 3, version: 'V2.4.2', releaseDate: '2023-12-20', description: '修复已知问题' },
]

export const machineryMock = {
  // POST /farm/car/new/list - 机器列表
  carNewList: (params: any) => {
    const page = params?.pageNum || params?.page || 1
    const size = params?.pageSize || params?.size || 10
    return createMockResponse(generateMachineList(page, size))
  },

  // GET /farm/car/new/detail - 机器详情
  carNewDetail: (carId: number, type: number) => {
    return createMockResponse(generateMachineDetail(carId))
  },

  // GET /farm/car/dealer - 经销商列表
  carDealer: () => {
    return createMockResponse(dealerList)
  },

  // POST /farm/car/status - 控制星基开关
  carStatus: (data: any) => {
    return createMockResponse({ 
      success: true, 
      message: `已${data.status === '1' ? '开启' : '关闭'}星基服务`,
      sn: data.sn 
    })
  },

  // POST /farm/log/choice - 控制日志上传
  logChoice: (sn: string, flag: string) => {
    return createMockResponse({
      success: true,
      message: `日志上传已${flag === '1' ? '开启' : '关闭'}`,
      sn
    })
  },

  // GET /farm/car/terminalType - 终端类型列表
  terminalTypeList: () => {
    return createMockResponse(terminalTypes)
  },

  // GET /farm/car/softList - 软件版本列表
  softList: (params: any) => {
    return createMockResponse({
      list: softVersions,
      total: softVersions.length
    })
  },

  // POST /farm/car/getTypeSnBySoft - 获取软件对应SN列表
  getTypeSnBySoft: (data: any) => {
    const snList = Array(5).fill(null).map((_, i) => ({
      sn: `SINO${String(Math.random()).slice(2, 10).toUpperCase()}`,
      carName: `农机${i + 1}号`,
      currentVersion: 'V2.4.0'
    }))
    return createMockResponse(snList)
  },

  // POST /farm/car/new/packageUpgradeList - 批量升级
  packageUpgradeList: (data: any) => {
    return createMockResponse({
      success: true,
      message: '批量升级指令已下发',
      taskId: Date.now().toString(),
      total: data.snList?.length || 0
    })
  },

  // GET /farmPoint/point/singleCarTrack - 历史轨迹
  singleCarTrack: (params: any) => {
    const trackPoints = Array(50).fill(null).map((_, i) => ({
      lat: 30.0 + Math.random() * 5,
      lng: 110.0 + Math.random() * 10,
      speed: Math.floor(Math.random() * 50),
      direction: Math.floor(Math.random() * 360),
      time: new Date(Date.now() - i * 60000).toISOString(),
      workStatus: Math.random() > 0.3 ? 1 : 0
    }))
    return createMockResponse({
      list: trackPoints,
      total: trackPoints.length,
      carId: params.carId,
      sn: params.sn
    })
  },

  // GET /farm/activationCode/getDays - 获取注册码天数
  getActivationCodeDays: (params: any) => {
    return createMockResponse({
      sn: params.sn,
      days: 365,
      expireDate: '2025-03-24',
      canGet: true
    })
  },

  // POST /farm/activationCode/pushCode - 取注册码
  pushActivationCode: (params: any) => {
    return createMockResponse({
      success: true,
      code: `AC${String(Math.random()).slice(2, 8).toUpperCase()}`,
      sn: params.sn,
      type: params.codeType || '临时码',
      expireTime: '2024-04-24 00:00:00'
    })
  },

  // GET /farm/activationCode/getCodePushLogs - 取注册码日志
  getActivationCodeLogs: (params: any) => {
    const logs = Array(5).fill(null).map((_, i) => ({
      id: i + 1,
      sn: params.sn,
      code: `AC${String(Math.random()).slice(2, 8).toUpperCase()}`,
      type: ['临时码', '永久码'][Math.floor(Math.random() * 2)],
      createTime: new Date(Date.now() - i * 86400000).toISOString(),
      operator: '管理员',
      status: '成功'
    }))
    return createMockResponse({
      list: logs,
      total: logs.length
    })
  }
}

export default machineryMock
