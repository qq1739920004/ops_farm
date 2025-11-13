import request from '@/utils/request'


// 求助处理列表
export function pageVehicle_API(params: any) {
    return request<any, any>({
        url: "/farm/vehicle/pageVehicle",
        method: 'get',
        params
    })
}
export function uploadImg_API(data: any) {
    return request<any, any>({
        url: `/farm/vehicle/uploadImage`,
        method: 'post',
        data,
        headers: { "Content-Type": "multipart/form-data" },
    })
}
export function getBindSnVO_API() {
    return request<any, any>({
        url: "/farm/vehicle/getBindSnVO",
        method: 'get',

    })
}

export function addVehicle_API(data: any) {
    return request<any, any>({
        url: `/farm/vehicle/addVehicle`,
        method: 'post',
        data
    })
}
export function detail_API(params: any) {
    return request<any, any>({
        url: `/farm/vehicle/detail`,
        method: 'get',
        params
    })
}
export function updateVehicle_API(data: any) {
    return request<any, any>({
        url: `/farm/vehicle/updateVehicle`,
        method: 'put',
        data
    })
}

type ApiResponse<T> = { code: number; message?: string; data: T }
export type CarTotalAreaStats = {
  totalWorkArea?: number
  currentYearWorkArea?: number
  todayWorkArea?: number
  todayCountNum?: number
}
export function getCarWorkAreaStats_path(params: { vehicleId: string | number }) {
  return request({
    url: '/farm/task/vehicle/totalArea',
    method: 'get',
    params
  }) as Promise<ApiResponse<CarTotalAreaStats>>
}

export type VehicleDailyWorkParams = { vehicleId: string | number; year: number; month: number }
export type DailyWorkItem = { date?: string; workArea?: number; workDuration?: number }
export function getVehicleDailyWorkAreaStats_path(params: VehicleDailyWorkParams) {
  return request({
    url: '/farm/task/vehicle/monthly/daily',
    method: 'get',
    params
  }) as Promise<ApiResponse<DailyWorkItem[]>>
}

export type VehicleMonthlyWorkParams = { vehicleId: string | number; year: number }
export type MonthlyWorkItem = { month?: number; totalWorkAreaMu?: number; totalWorkDuration?: number }
export function getVehicleMonthlyWorkAreaStats_path(params: VehicleMonthlyWorkParams) {
  return request({
    url: '/farm/task/vehicle/year',
    method: 'get',
    params
  }) as Promise<ApiResponse<MonthlyWorkItem[]>>
}

//查询单车指定年月的作业汇总（总面积+作业类型占比）
export type VehicleMonthlyWorkTypeSummaryParams = { vehicleId: string | number; year: number; month: number }
export type OperationTypeArea = {
  operationName?: string
  areaMu?: number
  proportion?: number
}
export type MonthlyWorkTypeSummary = {
  totalMonthAreaMu?: number
  operationTypeAreaList?: OperationTypeArea[]
}
export function getVehicleMonthlyWorkAreaStats_type_path(params: VehicleMonthlyWorkTypeSummaryParams) {
  return request({
    url: '/farm/task/vehicle/monthly/operation-type-summary',
    method: 'get',
    params
  }) as Promise<ApiResponse<MonthlyWorkTypeSummary>>
}

