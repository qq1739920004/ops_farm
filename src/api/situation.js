import request from '@/utils/request'

export function farmMachineDataStatistics_path(params) {
  return request({
    url: '/farm/device/farmMachineDataStatistics',
    method: 'post',
    params
  })
}
export function carDataCount_path(params) {
    return request({
      url: '/farm/car/carData/count',
      method: 'post',
      params
    })
  }

  export function provinceDataList_path(params) {
    return request({
      url: '/farm/car/provinceData/list',
      method: 'post',
      params
    })
  }
  export function cityDataList_path(params) {
    return request({
      url: '/farm/car/cityData/list',
      method: 'post',
      params
    })
  }
  export function onlineFarmMachinePosition_path(params) {
    return request({
      url: '/farm/device/onlineFarmMachinePosition',
      method: 'post',
      params
    })
  }
  export function district_path(params) {
    return request({
      url: 'https://restapi.amap.com/v3/config/district',
      method: 'get',
      params
    })
  }
  export function statCar_path(params) {
    return request({
      url: '/farm/stat/onlineCarStat',
      method: 'post',
      params
    })
  }
  export function paddyWorkStat_path(params) {
    return request({
      url: '/farm/stat/paddyWorkStat',
      method: 'post',
      params
    })
  }
