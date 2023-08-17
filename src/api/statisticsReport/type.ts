export interface ResponseData {
    message?: string,
    code?: number,
}
export interface FarmMachineObj{
    workArea: {
        todayArea: number,
        totalArea: number
    },
    car: {
        newCar: number
    },
    device: {
        totalDevice: number,
        onlineDevice: number
    },
    provinceRank: [
        {
            code: number,
            name: string,
            online: number,
            rank: string
        },   {
            code: number,
            name: string,
            online: number,
            rank: string
        }
        ,
        {
            code: number,
            name: string,
            online: number,
            rank: string
        }
    ]
}

// 接收数据类型
export interface FarmMachineResponseData extends ResponseData{
    data:FarmMachineObj
}