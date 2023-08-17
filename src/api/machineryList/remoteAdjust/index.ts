import request from '@/utils/request'
import { paramDescribeObj, paramDescribeResponseData, paramCarParamResponseData, paramcalibParamData, updateInfoObj } from './type'
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
        url: `param/carParam/update?carId=${updateInfo.carId}&updateTime=${updateInfo.updateTime}&createTime=${updateInfo.createTime}&paramJson=${updateInfo.paramJson}`,
        method: 'post',
    })
}
// 校准参数
export function paramCalibParam_API(carId: Number) {
    return request<any, paramcalibParamData>({
        url: `/param/calibParam/get?carId=${carId}`,
        method: 'get',
    })
}
// PID参数
export function pidParamParam_API(carId: Number) {
    return request<any, paramcalibParamData>({
        url: `/param/pidParam/get?carId=${carId}`,
        method: 'get',
    })
}