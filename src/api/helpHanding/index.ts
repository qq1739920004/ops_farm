import request from '@/utils/request'
import { HelpHandlingObj, HelpHandlingResponseData,HelpHandlingUncountData } from './type'
// 分页查询求助处理列表
export function getHelpHandlingAPI(params: HelpHandlingObj) {
    return request<any, HelpHandlingResponseData>({
        url: "/help/list",
        method: 'post',
        params
    })
}

// 未处理个数
export function getHelpHandlingUncountAPI() {
    return request({
        url: "/help/count",
        method: 'get',
    })
}

// 完成处理

export function getHelpHandlingFinishAPI() {
    return request<any,HelpHandlingUncountData>({
        url: "help/update",
        method: 'get',
    })
}