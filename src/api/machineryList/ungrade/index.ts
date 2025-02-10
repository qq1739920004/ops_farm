import request from '@/utils/request'
// 省份城市API
export function getmodelTitleList_API(pid: any) {
    return request<any, any>({
        url: `/farm/car/modelTitleList?pid=${pid}`,
        method: 'get',
    })
}
export function getmodelList_API(data: any) {
    return request<any, any>({
        url: `/farm/car/modelList`,
        method: 'post',
        data
    })
}
export function getmodelPackageList_API(mid: any) {
    return request<any, any>({
        url: `/farm/car/modelPackageList?mid=${mid}`,
        method: 'get',
    })
}
export function getpageModelSnList_API(data: any) {
    return request<any, any>({
        url: `/farm/car/pageModelSnList`,

        method: 'post',
        data
    })
}

export function modeUpgrade_API(data: any) {
    return request<any, any>({
        url: '/farm/car/modelUpgrade',
        method: 'post',
        data
    })
}
