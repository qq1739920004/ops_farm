import request from '@/utils/request'
// 作业管理地图模块
import { groupListDataObj, groupListResponseData } from './type'

export function getPaddyWorkGroupList_API(params: groupListDataObj) {
    return request<any, groupListResponseData>({
        url: '/paddyWork/group/list',
        method: 'get',
        params
    })
}

export function historyList_path(data: string[]) {
    return request({
        url: '/farm/paddyWork/history/list',
        method: 'post',
        data
    })
}