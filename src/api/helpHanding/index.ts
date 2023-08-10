import request from '@/utils/request'
import { HelpHandlingObj, HelpHandlingResponseData,HelpHandlingUncountData,HelpHandlingCarParamData } from './type'
// 分页查询求助处理列表s
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
        url: "/help/new/count",
        method: 'get',
    })
}


// 完成处理
export function getHelpHandlingFinishAPI(carId:number) {
    return request<any,HelpHandlingUncountData>({
        url: `help/update?carId=${carId}`,
        method: 'get',
    })
}


// 车辆参数
export function getHelpHandlingCarParamAPI(carId:number) {
    return request<any,HelpHandlingCarParamData>({
        url: `/param/carParam/get?carId=${carId}`,
        method: 'get',       
    })
}
// 报警记录
export function getHelpHandlingAlarmRecordAPI(carId:number) {
    return request<any,any>({
        url: `/car/alarmRecord/list?carId=${carId}`,
        method: 'get',      
    })
}
// 参数更改记录
export function getHelpHandlingParamChangeRecordAPI(carId:number) {
    return request<any,any>({
        url: `param/paramChangeRecord/get?carId=${carId}`,
        method: 'get',      
    })
}

// 校准参数
export function getHelpHandlingCalibParamAPI(carId:number) {
    return request<any,any>({
        url: `param/calibParam/get?carId=${carId}`,
        method: 'get',      
    })
}