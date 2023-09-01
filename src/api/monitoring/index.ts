import request from '@/utils/request'
// 作业管理模块API


export function monitorGet_API(data: any) {
    return request({
        url: "/monitor/get",
        method: 'get',
        data
    })
}