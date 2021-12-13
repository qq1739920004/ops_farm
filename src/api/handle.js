import request from '@/utils/request'

export function helpList_path(params) {
  return request({
    url: '/farm/help/list',
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
export function paramChangeRecordGet_path(params) {
  return request({
    url: '/farm/param/paramChangeRecord/get',
    method: 'post',
    params
  })
}
export function carList_path(params) {
  return request({
    url: '/farm/car/list',
    method: 'post',
    params
  })
}
export function paramDescribe_path(params) {
  return request({
    url: '/farm/param/paramDescribe',
    method: 'post',
    params
  })
}
export function carParamGet_path(params) {
  return request({
    url: '/farm/param/carParam/get',
    method: 'post',
    params
  })
}
export function calibParamGet_path(params) {
  return request({
    url: '/farm/param/calibParam/get',
    method: 'post',
    params
  })
}
export function pidParamGet_path(params) {
  return request({
    url: '/farm/param/pidParam/get',
    method: 'post',
    params
  })
}
export function pidCurveParamGet_path(params) {
  return request({
    url: '/farm/param/pidCurveParam/get',
    method: 'post',
    params
  })
}
export function pidSlsParamGet_path(params) {
  return request({
    url: '/farm/param/pidSlsParam/get',
    method: 'post',
    params
  })
}
export function handlerList_path(params) {
  return request({
    url: '/farm/help/handler/list',
    method: 'post',
    params
  })
}
export function helpUpdate_path(params) {
  return request({
    url: '/farm/help/update',
    method: 'post',
    params
  })
}
