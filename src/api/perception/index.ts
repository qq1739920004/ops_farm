
import request from '@/utils/request'
import {monitorResponseData} from './type'
// 未处理个数
export function getMonitorAPI() {
    return request<any, monitorResponseData>({
        url: "/monitor/get",
        method: 'get',
    })
}