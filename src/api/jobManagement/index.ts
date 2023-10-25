import request from '@/utils/request'
// 作业管理模块API

import { PageObj, paddyWorkListResponsenumber, dealerCarResponseData } from './type'
export function paddyWorkList_API(data: PageObj) {
    return request<any, paddyWorkListResponsenumber>({
        url: "/farm/paddyWork/list",
        method: 'post',
        data
    })
}

export function getCarDealerList_API(companyId: any ) {
    return request<any, dealerCarResponseData>({
        url: `/farm/car/dealer/car?companyId=${companyId}`,
        method: 'get'
    })
}


export function getPaddyWorkExport_API(data: PageObj) {
    return request<any, any>({
        url: '/farm/paddyWork/export',
        method: 'post',
        responseType: 'blob',
        data,
    })
}