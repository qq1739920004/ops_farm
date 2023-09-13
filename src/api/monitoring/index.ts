
import request from '@/utils/request'
// 作业管理模块API


import { onlineFarmMachinePosition_type } from './type'

export function onlineFarmMachinePosition_API(data: onlineFarmMachinePosition_type) {
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