
import request from '@/utils/request'
// 删除
export function filedPage_API(params: any) {
    return request<any, any>({
        url: '/farm/block/page',
        method: 'get',
        params
    })
}
export function suggest_API(params: any) {
    return request<any, any>({
        url: '/farm/block/suggest',
        method: 'get',
        params
    })
}

export function farmList_API() {
    return request<any, any>({
        url: '/farm/block/farm',
        method: 'get'
    })
}
export function block_API(params: any) {
    return request<any, any>({
        url: '/farm/block/detail',
        method: 'get',
        params
    })
}

export function addBlock_API(data: any) {
    return request<any, any>({
        url: '/farm/block/addBlock',
        method: 'post',
        data
    })
}

export function deleteBlock_API(params: any) {
    return request<any, any>({
        url: '/farm/block/deleteBlock',
        method: 'DELETE',
        params
    })
}

export function updateBlock_API(data: any) {
    return request<any, any>({
        url: '/farm/block/updateBlock',
        method: 'PUT',
        data
    })
}
export function share_API(params: any) {
    return request<any, any>({
        url: '/farm/block/check/share',
        method: 'get',
        params
    })
}
export function listVehicle_API() {
    return request<any, any>({
        url: '/farm/task/listVehicle',
        method: 'get',

    })
}
export function shareCar_API(params: any){
    return request<any,any>({
        url:'/farm/block/share',
        method:'get',
        params
    })
}
