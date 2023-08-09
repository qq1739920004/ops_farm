import request from '@/utils/request'
// 分页查询求助处理列表
export function getHelpHandlingfoAPI(params: any) {
    return request({
        url: "/help/list",
        method: 'post',
        params
    })
}
