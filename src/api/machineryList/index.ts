import request from '@/utils/request'
import { carNewListResponseData, carNewDetailResponseData, carDealerResponseData, carStatusObj, activationCodeObj, PageInfoObj, singleCarTrackResponseData } from '@/api/machineryList/type'
// 农机列表API接口// 分页查询
export function carNewList_API(data: string) {
    return request<any, carNewListResponseData>({
        url: `/farm/car/new/list`,
        method: 'post',
        data
    })
}
// 车辆详情/car/new/detail
export function carNewDetail_API(carId: Number) {
    return request<any, carNewDetailResponseData>({
        url: `/farm/car/new/detail?carId=${carId}`,
        method: 'get',
    })
}

// 经销商列表
export function carDealer_API() {
    return request<any, carDealerResponseData>({
        url: `/farm/car/dealer`,
        method: 'get',
    })
}
// 控制星基开关？
export function carStatus_API(data: carStatusObj) {
    return request<any, any>({
        url: `/farm/car/status`,
        method: 'post',
        data
    })
}
// 控制日志上传开关？
export function logOpen_API(sn: number) {
    return request<any, any>({
        url: `/farm/log/open?sn=${sn}`,
        method: 'post',
    })
}
export function logClose_API(sn: number) {
    return request<any, any>({
        url: `/farm/log/close?sn=${sn}`,
        method: 'post',
    })
}
// 注册时长
export function activationCodeAdd_API(params: activationCodeObj) {
    return request<any, any>({
        url: '/farm/activationCode/add',
        method: 'post',
        params
    })
}

// 获取历史轨迹
export function getSingleCarTrick_API(params: PageInfoObj) {
    return request<any, singleCarTrackResponseData>({
        url: 'farmPoint/point/singleCarTrack',
        method: 'get',
        params
    })
}