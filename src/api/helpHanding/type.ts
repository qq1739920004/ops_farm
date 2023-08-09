
export interface HelpHandlingObj {
    key: string
    status: number|null,
    currentPage: number,
    pageSize: number,
    helpTimeOrder: number,
    handleTimeOrder: number,
    assignTimeOrder: number
}



export interface ResponseData {
    message?: string,
    code?: number,

}


export interface RecordsObj {
    id: number,
    tel: string,
    sn: string,
    carId: number,
    status: number,
    helpTime: string,
    handleTime: string,
    assignTime: string,
    consumeTime: number|string,
    managerId: number,
    handlerId: number,
    managerName: string,
    handlerName: string,
    info: string
}


export interface HelpHandlingResponseData extends ResponseData {
    data: {
        total: number,
        records: RecordsObj[]
    }
}
export interface HelpHandlingUncountData extends ResponseData{
    data:number
}