import request from '@/utils/request'
// 作业管理模块API

import { onlineFarmMachinePosition_type } from './type'

export function onlineFarmMachinePosition_API(data: onlineFarmMachinePosition_type) {
    return request({
        url: "/device/onlineFarmMachinePosition",
        method: 'get',
        data
    })
}

export function farmMachineDataStatistics_API() {
    return request({
        url: "/device/new/farmMachineDataStatistics",
        method: 'get',
    })
}

