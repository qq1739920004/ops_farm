import request from '@/utils/request'
import {FarmMachineResponseData,getStatisticsReportnetworkAPIResponse,getStatisticsReportcarjobAPIResponse, timeParams,getStatisticsWxAPIResponse,getStatisticsRemoteAPIResponse,getStatisticsStatAPIResponse} from './type'
// 农机在线位置
export function getStatisticsReportonlinePositionAPI() {
    return request<any, any>({
        url: "/farm/device/onlineFarmMachinePosition",
      method: 'get',
    })
  }
// 农机作业统计
export function getStatisticsReportcarjobAPI() {
    return request<any, getStatisticsReportcarjobAPIResponse>({
        url: "/farm/stat/rank/province",
      method: 'get',
    })
}
//  网络状况
export function getStatisticsReportnetworkAPI() {
    return request<any,getStatisticsReportnetworkAPIResponse>({
        url: "/farm/device/new/onlineFarmMachineNet",
      method: 'get',
    })
  }
// 农机数据统计
  export function getStatisticsReportfarmMachineAPI() {
    return request<any, FarmMachineResponseData>({
        url: "/farm/device/new/farmMachineDataStatistics",
      method: 'get',
    })
  }
// 功能统计，参数同步统计
  export function getStatisticsWxAPI(params: timeParams) {
    return request<timeParams, getStatisticsWxAPIResponse>({
        url: "/farm/stat/wxAndParam",
      method: 'get',
      params,
    })
  }
// 远程校准次数、设置数据链次数、注册次数，小程序合并接口
  export function getStatisticsRemoteAPI(params: timeParams) {
    return request<timeParams, getStatisticsRemoteAPIResponse>({
        url: "/farm/stat/remote",
      method: 'get',
      params,
    })
  }
// 农业监控页面访问、车辆列表页面访问统计合
  export function getStatisticsStatAPI(params: timeParams) {
    return request<timeParams, getStatisticsStatAPIResponse>({
        url: "/farm/stat/page",
      method: 'get',
      params,
    })
  }

  //统计报表总数据头
export function statistiHead(){
  return request({
    url:`/farm/report/title`,
    method:'get',
  })
}
//统计报表列表
export function statisticalList(data:any){
  return request({
    url:`/farm/report/list`,
    method:'get',
    params:data
  })
}
//统计报表列表导出
export function statisticalExport(data:any){
  return request({
    url:`/farm/report/export`,
    method:'get',
    responseType: 'blob',
    params:data
  })
}
//激活总量折线图
export function statisticalLineData(){
  return request({
    url:`/farm/report/foldLine`,
    method:'get',
  })
}


