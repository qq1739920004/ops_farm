import request from '@/utils/request'
//公用的相关请求接口-
export function test_path(params: any) {
    return request({
        url: '/m1/2885822-0-default/carModuleInfo/get',
        method: 'get',
        params
    })
}