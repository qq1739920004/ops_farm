import request from '@/utils/request'
import { HelpHandlingObj, HelpHandlingResponseData,HelpHandlingUncountData,HelpHandlingParamData } from './type'

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
export function getHelpHandlingFinishAPI(carId:number,status:number) {
    return request<any,HelpHandlingUncountData>({
        url: `help/update?carId=${carId}&${status}`,
        method: 'get',
    })
}


// 参数更改
export function getHelpHandlingParamChangeAPI(carId:number) {
    return request<any,any>({
        url: `/param/paramChangeRecord/get?carId=${carId}`,
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


// 车辆参数
export function getHelpHandlingCarParamAPI(carId:number) {
    return request<any,HelpHandlingParamData>({
        url: `/param/carParam/get?carId=${carId}`,
        method: 'get',       
    })
}
// 校准参数
export function getHelpHandlingCalibParamAPI(carId:number) {
    return request<any,HelpHandlingParamData>({
        url: `param/calibParam/get?carId=${carId}`,
        method: 'get',      
    })
}
// PID参数
export function getHelpHandlinPIDParamAPI(carId:number) {
    return request<any,HelpHandlingParamData>({
        url: `param/pidParam/get?carId=${carId}`,
        method: 'get',      
    })
}