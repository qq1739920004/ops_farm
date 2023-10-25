import request from '@/utils/request'
import {
    HelpHandlingObj, HelpHandlingResponseData, HelpHandlingParamData, HelpHandlingAlarmData,
    HelpHandlerData, RecordsObj, FinishData
} from './type'

// 求助处理列表
export function getHelpHandlingAPI(data: HelpHandlingObj) {
    return request<any, HelpHandlingResponseData>({
        url: "/farm/help/new/list",
        method: 'post',
        data
    })
}

// 未处理个数
export function getHelpHandlingUncountAPI() {
    return request({
        url: "/farm/help/new/count",
        method: 'get',
    })
}
// 处理人列表
export function getHelpHandlerAPI() {
    return request<any, HelpHandlerData>({
        url: `/farm/help/handler/new/list`,
        method: 'get',
    })
}

// 完成处理
export function getHelpHandlingFinishAPI(params: RecordsObj) {
    return request<any, FinishData>({
        url: `/farm/help/update?id=${params.id}&carId=${params.carId}&status=${params.status}&handlerId=${params.handlerId}&info=${params.info}`,
        method: 'get'
    })
}


// 参数更改
export function getHelpHandlingParamChangeAPI(carId: number) {
    return request<any, any>({
        url: `/farm/param/paramChangeRecord/get?carId=${carId}`,
        method: 'get',
    })
}


// 报警记录
export function getHelpHandlingAlarmRecordAPI(carId: number) {
    return request<any, HelpHandlingAlarmData>({
        url: `/farm/car/alarmRecord/list?carId=${carId}&pageSize=1&currentPage=10`,
        method: 'get',
    })
}


// 车辆参数
export function getHelpHandlingCarParamAPI(carId: number) {
    return request<any, HelpHandlingParamData>({
        url: `/farm/param/new/carParam/get?carId=${carId}`,
        method: 'get',
    })
}
// 校准参数
export function getHelpHandlingCalibParamAPI(carId: number) {
    return request<any, HelpHandlingParamData>({
        url: `/farm/param/new/calibParam/get?carId=${carId}`,
        method: 'get',
    })
}
// PID参数
export function getHelpHandlinPIDParamAPI(carId: number) {
    return request<any, HelpHandlingParamData>({
        url: `/farm/param/new/pidParam/get?carId=${carId}`,
        method: 'get',
    })
}

// PID曲线参数更新
export function getPidCurveParmAPI(carId: number) {
    return request<any, HelpHandlingParamData>({
        url: `/farm/param/new/pidCurveParam/get?carId=${carId}`,
        method: 'get',
    })
}
// PID超低速参数
export function getPidSlsParamAPI(carId: number) {
    return request<any, HelpHandlingParamData>({
        url: `/farm/param/new/pidSlsParam/get?carId=${carId}`,
        method: 'get',
    })
}