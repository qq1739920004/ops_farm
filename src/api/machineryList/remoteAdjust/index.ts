import request from '@/utils/request'
import { paramDescribeObj, paramDescribeResponseData, paramCarParamResponseData, paramcalibParamData, updateInfoObj, SourceObj, paramSourceNodeREsponseData, updateCarResponseData, updateCarObj, carProductpackageObj, GetcarProductpackageResponseData, CarpackageUpgradeInfoObj } from './type'
// 获取远程参数列表
export function paramParamDescribe_API(data: paramDescribeObj) {
    return request<any, paramDescribeResponseData>({
        url: `/farm/param/new/paramDescribe?version=${data.paramVersionnum}&type=${data.type}&paramType=${data.paramType}`,
        method: 'get',
    })
}
// 车辆参数
export function paramCarParam_API(carId: Number) {
    return request<any, paramCarParamResponseData>({
        url: `/farm/param/new/carParam/get?carId=${carId}`,
        method: 'get',
    })
}
// 车辆参数更新
export function paramCarParamUpdate_API(updateInfo: updateInfoObj) {
    return request<any, any>({
        url: `/farm/param/new/carParam/update`,
        method: 'post',
        params: updateInfo
    })
}
// 校准参数
export function paramCalibParam_API(carId: Number) {
    return request<any, paramcalibParamData>({
        url: `/farm/param/new/calibParam/get?carId=${carId}`,
        method: 'get',
    })
}
// 校准参数更新
export function updateCalibParam_API(params: updateInfoObj) {
    return request<any, any>({
        url: '/farm/param/new/calibParam/update',
        method: 'post',
        params
    })
}
// PID参数
export function pidParamParam_API(carId: Number) {
    return request<any, paramcalibParamData>({
        url: `/farm/param/new/pidParam/get?carId=${carId}`,
        method: 'get',
    })
}
// PID参数更新
export function updatePidParm_API(params: updateInfoObj) {
    return request<any, any>({
        url: '/farm/param/new/pidParam/update',
        method: 'post',
        params
    })
}
// 基本参数basicParamParam_API
export function basicParam_API(carId: Number) {
    return request<any, paramcalibParamData>({
        url: `/farm/param/new/basicParam/get?carId=${carId}`,
        method: 'get',
    })
}
// PID曲线参数
export function pidCurveParam_API(carId: Number) {
    return request<any, paramcalibParamData>({
        url: `/farm/param/new/pidCurveParam/get?carId=${carId}`,
        method: 'get',
    })
}
// PID曲线参数更新
export function updatePidCurveParm_API(params: updateInfoObj) {
    return request<any, any>({
        url: '/farm/param/new/pidCurveParam/update',
        method: 'post',
        params
    })
}
// 更新基本参数
export function updateBasicParm_API(params: updateInfoObj) {
    return request<any, any>({
        url: '/farm/param/new/basicParam/update',
        method: 'post',
        params
    })
}
// PID超低速曲线参数/param/pidSlsParam/get
export function pidSlsParam_API(carId: Number) {
    return request<any, paramcalibParamData>({
        url: `/farm/param/new/pidSlsParam/get?carId=${carId}`,
        method: 'get',
    })
}
// PID超低速曲线参数更新/param/pidSlsParam/update
export function updatepidSlsParam_API(params: updateInfoObj) {
    return request<any, any>({
        url: '/farm/param/new/pidSlsParam/update',
        method: 'post',
        params
    })
}
// 差分设置获取源节点
export function getSourceNode_path(params: SourceObj) {
    return request<any, paramSourceNodeREsponseData>({
        url: '/farm/param/new/getSourceNode',
        method: 'post',
        params
    })
}
// 差分设置参数更新
export function updateCar_API(params: updateCarObj) {
    return request<any, updateCarResponseData>({
        url: '/farm/car/update',
        method: 'post',
        params
    })
}
// 在线升级/版本选择/car/productPackage
export function GetcarProductpackage_API(params: carProductpackageObj) {
    return request<any, GetcarProductpackageResponseData>({
        url: '/farm/car/new/productPackage',
        method: 'get',
        params
    })
}
// 在线升级更新 /car/packageUpgrade
export function packageUpgradeCar_API(params: CarpackageUpgradeInfoObj) {
    return request<any, any>({
        url: '/farm/car/new/packageUpgrade',
        method: 'post',
        params
    })
}
// 获取PID曲线参数/param/pidCurveParam/get
export function GetParamPidCurveParam_API(params: carProductpackageObj) {
    return request<any, GetcarProductpackageResponseData>({
        url: '/farm/car/new/productPackage',
        method: 'get',
        params
    })
}
// 获取高级参数数据
export function getAdvanced1Param_API(carId: Number) {
    return request<any, any>({
        url: `/farm/param/new/advanced1Param/get?carId=${carId}`,
        method: 'get',
    })
}
// 更新高级参数数据
export function advanced1ParamUpdate_API(params: updateInfoObj) {
    return request<any, any>({
        url: '/farm/param/new/advanced1Param/update',
        method: 'post',
        params
    })
}