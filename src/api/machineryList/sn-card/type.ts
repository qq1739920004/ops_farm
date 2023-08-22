export interface ResponseData {
    message?: string,
    code?: number,
}
export interface ProvinceDataNewListObj {
    code: string,
    name: string,
    totalCar: number,
    onlineCar: number,
    todayArea: number,
    totalArea: number
}

export interface ProvinceDataNewListResponseData extends ResponseData {
    data: ProvinceDataNewListObj[]
}

export interface CityDataNewListObj {
    code: string,
    name: string,
    totalCar: number,
    onlineCar: number,
    todayArea: number,
    totalArea: number
}
export interface CityDataNewListResponseData extends ResponseData {
    data: CityDataNewListObj[]
}