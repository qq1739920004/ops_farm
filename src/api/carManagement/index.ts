import request from '@/utils/request'


// 求助处理列表
export function pageVehicle_API(params: any) {
    return request<any, any>({
        url: "/farm/vehicle/pageVehicle",
        method: 'get',
        params
    })
}
export function uploadImg_API(data: any) {
    return request<any, any>({
        url: `/farm/vehicle/uploadImage`,
        method: 'post',
        data,
        headers: { "Content-Type": "multipart/form-data" },
    })
}
export function getBindSnVO_API() {
    return request<any, any>({
        url: "/farm/vehicle/getBindSnVO",
        method: 'get',

    })
}

export function addVehicle_API(data: any) {
    return request<any, any>({
        url: `/farm/vehicle/addVehicle`,
        method: 'post',
        data
    })
}
export function detail_API(params: any) {
    return request<any, any>({
        url: `/farm/vehicle/detail`,
        method: 'get',
        params
    })
}
export function updateVehicle_API(data: any) {
    return request<any, any>({
        url: `/farm/vehicle/updateVehicle`,
        method: 'put',
        data
    })
}
