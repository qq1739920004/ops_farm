
export interface ResponseData {
    message?: string,
    code?: number,
}
export interface PageObj {
    key: string,
    terminalType: string,
    currentPage: number,
    pageSize: number
}
export interface RecordsObj {
    id: number | null
}

export interface newRecordsObj {
    carImuSn?: string,
    hubSn?: string,
    antennaTwo?: string,
    wheelImuSn?: string,
    id?: number | null,
    superCattleModuleInfo?: string,
    sn?: string,
    npn?: string,
    steeringWheelSn?: string,
    warrantyDate?: string,
    antennaOne?: string,
    type: string,
    terminalType?: string,
    motorSn?: string,
}

export interface carModuleInfoResponseData extends ResponseData {
    data: {
        total: number,
        records: RecordsObj[]
    }
}

export interface changeResponseData extends ResponseData {
    data: {}
}
export interface editResponseData extends ResponseData {
    data: boolean
}
export interface SaleResponseData extends ResponseData {
    data: RecordsObj
}
export interface LogObj {
    userId: number,
    npn: string,
    carId: number,
    operation: string,
    dateTime: string
}

export interface carModuleInfoOperationLogResponseData extends ResponseData {
    data: LogObj[]
}
export interface carMoudleInfoDeleteResponseData extends ResponseData {
    data: string
}

export interface carMoudleInfoGetLeftResponseData extends ResponseData {
    data: MoudleInfoGetLeftObj
}


export interface MoudleInfoGetLeftObj {
    id: number,
    terminalType: string,
    npn: string,
    sn: string,
    hubSn: string,
    motorSn: string,
    steeringWheelSn: string,
    carImuSn: string,
    wheelImuSn: string,
    antennaOne: string,
    antennaTwo: string,
    superCattleModuleInfo: string,
    warrantyDate: string,
    satelliteDate: string,
    expirationTime: string,
    netDate: string,
    username: string,
    userId: number,
    companyId: number,
    companyName: string,
    tel: string,
    creatorName: string,
    creatorId: number,
    code: string,
    activationTime?:string
}