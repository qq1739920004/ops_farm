import request from '@/utils/request'
export function deviceList_API(params: any) {
    return request({
        url: "/farm/device-base/page",
        method: 'get',
        params
    })
}
export function addDevice_API(params: any) {
    return request({
        url: "/farm/device-base/add",
        method: 'post',
        params
    })
}
export function getDetail_API(params: any) {
    return request({
        url: "/farm/device-base/detail",
        method: 'get',
        params
    })
}
export function update_API(params: any) {
    return request({
        url: "/farm/device-base/update",
        method: 'put',
        params
    })
}
export function delete_API(params: any) {
    return request({
        url: "/farm/device-base/delete",
        method: 'delete',
        params
    })
}