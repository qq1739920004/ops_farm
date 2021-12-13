import request from '@/utils/request'

export function farmMachineDataStatistics_path(params) {
  return request({
    url: '/farm/device/farmMachineDataStatistics',
    method: 'post',
    params
  })
}
export function wxAndParam_path(params) {
  return request({
    url: '/farm/stat/wxAndParam',
    method: 'post',
    params
  })
}
export function remote_path(params) {
  return request({
    url: '/farm/stat/remote',
    method: 'post',
    params
  })
}
export function page_path(params) {
  return request({
    url: '/farm/stat/page',
    method: 'post',
    params
  })
}
export function province_path(params) {
  return request({
    url: '/farm/stat/rank/province',
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
