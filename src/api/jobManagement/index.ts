import request from '@/utils/request'
// 作业管理模块API

import { PageObj, paddyWorkListResponsenumber } from './type'
export function paddyWorkList_API(data: PageObj) {
    return request<any, paddyWorkListResponsenumber>({
        url: "/paddyWork/list",
        method: 'post',
        data
    })
}