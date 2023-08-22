import request from '@/utils/request'
// 省份城市API
import { ProvinceDataNewListResponseData, CityDataNewListResponseData } from './type'
export function getProvinceDataNewList_API() {
    return request<any, ProvinceDataNewListResponseData>({
        url: "/car/provinceData/new/list",
        method: 'get',
    })
}
// 地级市数据API
export function getCityDataNewList_API(provinceCode: string) {
    return request<any, CityDataNewListResponseData>({
        url: `/car/cityData/new/list?provinceCode=${provinceCode}`,
        method: 'get',
    })
}