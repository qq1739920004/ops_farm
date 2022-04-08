import request from '@/utils/request'

export function carList_path(params) {
  return request({
    url: '/farm/car/list',
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
  export function sacredCowQrList_path(params) {
    return request({
      url: '/farm/sacredCowQr/list',
      method: 'post',
      params
    })
  }
  export function sacredCowQrSave_path(params) {
    return request({
      url: '/farm/sacredCowQr/save',
      method: 'post',
      params
    })
  }
  export function sacredCowQrUpdate_path(params) {
    return request({
      url: '/farm/sacredCowQr/update',
      method: 'post',
      params
    })
  }
  export function sacredCowQrRemove_path(params) {
    return request({
      url: '/farm/sacredCowQr/remove',
      method: 'post',
      params
    })
  }
  export function sacredCowQrExport_path(params) {
    return request({
      url: '/farm/sacredCowQr/export',
      method: 'post',
      params
    })
  }
  export function provinceList_path(params) {
    return request({
      url: '/farm/car/track/provinceList',
      method: 'get',
      params
    })
  }

  export function filterCar_path(data) {
    return request({
      url: '/farm/car/track/provinces/filterCar',
      method: 'post',
      data
    })
  }
  export function singleCarTrack_path(data) {
    return request({
      url: '/farm/point/singleCarTrack',
      method: 'post',
      data
    })
  }
  export function activationCodeAdd_path(params) {
    return request({
      url: '/farm/activationCode/add',
      method: 'post',
      params
    })
  }
  export function searchNearABPt_path(params) {
    return request({
      url: '/farm/paddyWork/searchNearABPt',
      method: 'post',
      params
    })
  }
  export function pushABPoint_path(params) {
    return request({
      url: '/farm/paddyWork/pushABPoint',
      method: 'post',
      params
    })
  }
  export function alarmRecordStatistics_path(params) {
    return request({
      url: '/farm/car/alarmRecord/statistics',
      method: 'post',
      params
    })
  }
  export function alarmRecordList_path(params) {
    return request({
      url: '/farm/car/alarmRecord/list',
      method: 'post',
      params
    })
  }
  export function logInfo_path(params) {
    return request({
      url: '/farm/car/log/info',
      method: 'post',
      params
    })
  }
  export function logUpdate_path(params) {
    return request({
      url: '/farm/car/log/update',
      method: 'post',
      params
    })
  }
  export function permissionList(params) {
    return request({
      url: '/farm/role/permission/list',
      method: 'post',
      params
    })
  }
  export function logOpen_path(params) {
    return request({
      url: '/farm/log/open',
      method: 'post',
      params
    })
  }
  export function logClose_path(params) {
    return request({
      url: '/farm/log/close',
      method: 'post',
      params
    })
  }
  export function carDetail_path(params) {
    return request({
      url: '/farm/car/detail',
      method: 'post',
      params
    })
  }