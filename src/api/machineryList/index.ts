import request from '@/utils/request'
import { carNewListResponseData, pageInfo, carNewDetailResponseData, carDealerResponseData, carStatusObj, activationCodeObj } from '@/api/machineryList/type'
// 农机列表API接口// 分页查询
export function carNewList_API(params: pageInfo) {
    return request<any, carNewListResponseData>({
        url: `/car/new/list`,
        method: 'post',
        params
    })
}
// 车辆详情/car/new/detail
export function carNewDetail_API(carId: Number) {
    return request<any, carNewDetailResponseData>({
        url: `/car/new/detail?carId=${carId}`,
        method: 'get',
    })
}

// 经销商列表
export function carDealer_API() {
    return request<any, carDealerResponseData>({
        url: `/car/dealer`,
        method: 'get',
    })
}
// 控制星基开关？
export function carStatus_API(data: carStatusObj) {
    return request<any, any>({
        url: `/car/status`,
        method: 'post',
        data
    })
}
// 控制日志上传开关？
export function logOpen_API(sn: number) {
    return request<any, any>({
        url: `/log/open?sn=${sn}`,
        method: 'post',
    })
}
export function logClose_API(sn: number) {
    return request<any, any>({
        url: `/log/close?sn=${sn}`,
        method: 'post',
    })
}
// 注册时长
export function activationCodeAdd_API(params: activationCodeObj) {
    return request<any,any> ({
        url: '/activationCode/add',
        method: 'post',
        params
    })
}