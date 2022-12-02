import request from '@/utils/request'

export function carLog_path(params) {
  return request({
    url: '/farm/mongo/carLog',
    method: 'post',
    params
  })
}

export function farmMachineDataStatistics_path(params) {
  return request({
    url: '/farm/device/farmMachineDataStatistics',
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

export function mapStatus_path(params) {
  return request({
    url: '/DiffServer/smartBase/mapStatus',
    method: 'get',
    params
  })
}

export function tendency_path(data) {
  return request({
    url: '/farm/point/tendency',
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
export function driveStatus_path(params) {
  return request({
    url: '/farm/car/driveStatus',
    method: 'get',
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
export function carList_path(params) {
  return request({
    url: '/farm/car/list',
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
export function getSourceNode_path(params) {
  return request({
    url: '/farm/param/getSourceNode',
    method: 'post',
    params
  })
}

export function getPidParam_path(params) {
  return request({
    url: '/farm/param/pidParam/get',
    method: 'post',
    params
  })
}

export function getPidCurveParam_path(params) {
  return request({
    url: '/farm/param/pidCurveParam/get',
    method: 'post',
    params
  })
}
export function getPidSlsParam_path(params) {
  return request({
    url: '/farm/param/pidSlsParam/get',
    method: 'post',
    params
  })
}
export function getBasicParam_path(params){
  return request({
    url:'/farm/param/basicParam/get',
    method:'post',
    params
  })
}
export function getAdvanced1Param_path(params){
  return request({
    url:'/farm/param/advanced1Param/get',
    method:'post',
    params
  })
}
export function getAdvanced2Param_path(params){
  return request({
    url:'/farm/param/advanced2Param/get',
    method:'post',
    params
  })
}
export function getTool_path(params){
  return request({
    url:'/farm/param/farmtoolParam/get',
    method:'post',
    params
  })
}

export function update_carParam_path(params) {
  return request({
    url: '/farm/param/carParam/update',
    method: 'post',
    params
  })
}
export function update_calibParam_path(params) {
  return request({
    url: '/farm/param/calibParam/update',
    method: 'post',
    params
  })
}
export function updatePidParam_path(params) {
  return request({
    url: '/farm/param/pidParam/update',
    method: 'post',
    params
  })
}

export function updatePidCurveParam_path(params) {
  return request({
    url: '/farm/param/pidCurveParam/update',
    method: 'post',
    params
  })
}
export function updatePidSlsParam_path(params) {
  return request({
    url: '/farm/param/pidSlsParam/update',
    method: 'post',
    params
  })
}
export function updateBasicParam_path(params){
  return request({
    url: '/farm/param/basicParam/update',
    method: 'post',
    params
  })
}
export function updateAdvanced1Param_path(params){
  return request({
    url: '/farm/param/advanced1Param/update',
    method: 'post',
    params
  })
}
export function updateAdvanced2Param_path(params){
  return request({
    url: '/farm/param/advanced2Param/update',
    method: 'post',
    params
  })
}


export function updateCar_path(params) {
  return request({
    url: '/farm/car/update',
    method: 'post',
    params
  })
}

export function getVersionPackage_path(params){
  return request({
    url:'/farm/car/productPackage',
    method:'post',
    data:params
  })
}
export function onlineUpgrade_path(params) {
  return request({
    url: '/farm/car/PackageUpgrade',
    method: 'post',
    params
  })
}

export function modelVersion_path(params) {
  return request({
    url: '/farm/car/onlineUpgrade/modelVersion',
    method: 'post',
    params
  })
}
export function setFileUpload(params) {
  return request({
    url: '/lu/ftp/upload',
    method: 'post',
    data: params
  })
}