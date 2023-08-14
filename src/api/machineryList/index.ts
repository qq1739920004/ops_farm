import request from '@/utils/request'
import { carNewListResponseData, pageInfo, carNewDetailResponseData } from '@/api/machineryList/type'
// 农机列表API接口// 分页查询
export function carNewList_API(data: pageInfo) {
    return request<any, carNewListResponseData>({
        url: "/car/new/list",
        method: 'post',
        data
    })
}
// 车辆详情/car/new/detail
export function carNewDetail_API(carId: Number) {
    return request<any, carNewDetailResponseData>({
        url: `/car/new/detail?carId=${carId}`,
        method: 'get',
    })
}