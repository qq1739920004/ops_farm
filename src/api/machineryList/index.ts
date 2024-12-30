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
export function carNewDetail_API(carId: Number, type: number) {
    return request<any, carNewDetailResponseData>({
        url: `/farm/car/new/detail?carId=${carId}&type=${type}`,
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
export function logOpen_API(data: { sn: string, flag: string }) {
    return request<any, any>({
        url: `/farm/log/choice?sn=${data.sn}&flag=${data.flag}`,
        method: 'post',
    })
}
// export function logClose_API(sn: number) {
//     return request<any, any>({
//         url: `/farm/log/close?sn=${sn}`,
//         method: 'post',
//     })
// }
// 注册时长
export function activationCodeAdd_API(params: activationCodeObj) {
    return request<any, any>({
        url: '/farm/activationCode/new/add',
        method: 'post',
        params
    })
}

// 获取历史轨迹
export function getSingleCarTrick_API(params: PageInfoObj) {
    return request<any, singleCarTrackResponseData>({
        url: '/farmPoint/point/singleCarTrack',
        method: 'get',
        params
    })
}

// 文件存储
export function getChildrenFileList_API(params: any) {
    return request<any, any>({
        url: '/lu/log/filesForSn',
        method: 'post',
        data: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
    })
}
export function getBackFileSnList(params: any) {
    return request<any, any>({
        url: '/lu/log/ftpDirListFiles',
        method: 'post',
        data: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
    })
}

// 下载模板
export function getDownTemplate_API() {
    return request<any, any>({
        url: '/farm/car/downTemplate',
        method: 'get',
        responseType: 'blob',
    })
}
// 软件版本
export function getsoftList_API(params:any) {
    return request<any, any>({
        url: `/farm/car/softList`,
        method: 'get',
        params
    })
}
// 软件sn列表
export function getTypeSnList_API(data:any) {
    return request<any,any>({
        url:`/farm/car/getTypeSnBySoft`,
        method:'post',
        data

    })
}
// 批量升级
export function upgradeList_API(data:any) {
    return request<any,any>({
        url:`/farm/car/new/packageUpgradeList`,
        method:'post',
        data
    })
}

export function terminalTypeList_API(){
    return request<any,any>({
        url:'/farm/car/terminalType',
        method:'get'
    })
} 


