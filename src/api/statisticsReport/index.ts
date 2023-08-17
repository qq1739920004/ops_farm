import request from '@/utils/request'
import {FarmMachineResponseData} from './type'
// 农机在线位置

export function getStatisticsReportonlinePositionAPI() {
    return request<any, any>({
        url: "/device/onlineFarmMachinePosition",
      method: 'get',
    })
  }
// 农机数据统计
  export function getStatisticsReportfarmMachineAPI() {
    return request<any, FarmMachineResponseData>({
        url: "/device/farmMachineDataStatistics",
      method: 'get',
    })
  }
// // 功能统计，参数同步统计
//   export function getStatisticsWxAPI() {
//     return request<any, any>({
//         url: "/stat/wxAndParam",
//       method: 'get',
//     })
//   }
// 远程校准次数、设置数据链次数、注册次数，小程序合并接口
  export function getStatisticsRemoteAPI() {
    return request<any, any>({
        url: "/stat/remote",
      method: 'get',
    })
  }
// 农业监控页面访问、车辆列表页面访问统计合
  export function getStatisticsStatAPI() {
    return request<any, any>({
        url: "/stat/page",
      method: 'get',
    })
  }
// 总车辆数、按省份排名
  export function getStatisticsProvinceAPI() {
    return request<any, any>({
        url: "/stat/rank/province",
      method: 'get',
    })
  }
