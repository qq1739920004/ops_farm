
import request from '@/utils/request'
// 作业管理模块API


import { onlineFarmMachinePosition_Type, carLog_Type, driveStatusPathResponseData, paramsObj, driveTendenctResponseData } from './type'

export function onlineFarmMachinePosition_API(data: onlineFarmMachinePosition_Type) {
    return request({
        url: "/farm/device/new/onlineFarmMachinePosition",
        method: 'get',
        data
    })
}

export function farmMachineDataStatistics_API() {
    return request({
        url: "/farm/device/new/farmMachineDataStatistics",
        method: 'get',
    })
}

export function carLog_API(params: carLog_Type) {
    return request({
        url: "/farm/mongo/new/carLog",
        method: 'get',
        params
    })
}


export function driveStatusPath_API(sn: string) {
    return request<any, driveStatusPathResponseData>({
        url: `/farmPoint/car/driveStatus?sn=${sn}`,
        method: 'get'
    })
}


export function driveTendency_API(params: paramsObj) {
    return request<any, driveTendenctResponseData>({
        url: `/farmPoint/point/tendency`,
        method: 'get',
        params
    })
}