import request from '@/utils/request'
// 作业管理地图模块
import { groupListDataObj, groupListResponseData } from './type'

export function getPaddyWorkGroupList_API(params: groupListDataObj) {
    return request<any, groupListResponseData>({
        url: '/farm/paddyWork/group/list',
        method: 'get',
        params
    })
}

// 位置点服务测试网关
export function historyList_path(data: string) {
    return request({
        url: `/farmPoint/paddyWork/history/list?ids=${data}`,
        method: 'get',
        data
    })
}