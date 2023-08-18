import request from '@/utils/request'
import { paramDescribeObj, paramDescribeResponseData, paramCarParamResponseData, paramcalibParamData, updateInfoObj, SourceObj, paramSourceNodeREsponseData, updateCarResponseData, updateCarObj,carProductpackageObj,GetcarProductpackageResponseData } from './type'
// 获取远程参数列表
export function paramParamDescribe_API(data: paramDescribeObj) {
    return request<any, paramDescribeResponseData>({
        url: `/param/paramDescribe?version=${data.version}&type=${data.type}&paramType=${data.paramType}`,
        method: 'get',
    })
}
// 车辆参数
export function paramCarParam_API(carId: Number) {
    return request<any, paramCarParamResponseData>({
        url: `/param/carParam/get?carId=${carId}`,
        method: 'get',
    })
}
// 车辆参数更新
export function paramCarParamUpdate_API(updateInfo: updateInfoObj) {
    return request<any, any>({
        url: `param/carParam/update`,
        method: 'post',
        params: updateInfo
    })
}
// 校准参数
export function paramCalibParam_API(carId: Number) {
    return request<any, paramcalibParamData>({
        url: `/param/calibParam/get?carId=${carId}`,
        method: 'get',
    })
}
// 校准参数更新
export function updateCalibParam_API(params: updateInfoObj) {
    return request<any, any>({
        url: '/param/calibParam/update',
        method: 'post',
        params
    })
}
// PID参数
export function pidParamParam_API(carId: Number) {
    return request<any, paramcalibParamData>({
        url: `/param/pidParam/get?carId=${carId}`,
        method: 'get',
    })
}
// PID参数更新
export function updatePidParm_API(params: updateInfoObj) {
    return request<any, any>({
        url: '/param/pidParam/update',
        method: 'post',
        params
    })
}
// 差分设置获取源节点
export function getSourceNode_path(params: SourceObj) {
    return request<any, paramSourceNodeREsponseData>({
        url: '/param/getSourceNode',
        method: 'post',
        params
    })
}
// 差分设置参数更新
export function updateCar_API(params: updateCarObj) {
    return request<any, updateCarResponseData>({
        url: '/car/update',
        method: 'post',
        params
    })
}
// 在线升级/版本选择/car/productPackage
export function GetcarProductpackage_API(params: carProductpackageObj) {
    return request<any, GetcarProductpackageResponseData>({
        url: '/car/productPackage',
        method: 'get',
        params
    })
}