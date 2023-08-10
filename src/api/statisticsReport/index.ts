import request from '@/utils/request'
// 车辆数据统计
export function getStatisticsReportfarmMachineAPI() {
    return request<any, any>({
        url: "/device/farmMachineDataStatistics",
      method: 'get',
    })
  }
