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
    carImuSn: string,
    hubSn: string,
    code: string,
    expirationTime: string,
    netDate: string,
    superCattleModuleInfo: string,
    npn: string,
    warrantyDate: string,
    tel: string,
    creatorName: string,
    companyId: number,
    satelliteDate: string,
    terminalType: string,
    id: number | null,
    steeringWheelSn: string,
    wheelImuSn: string,
    antennaTwo: string,
    creatorId: number,
    userId: number,
    motorSn: string,
    username: string,
    antennaOne: string,
    companyName: string,
    sn: string,
    type: string
}

export interface newRecordsObj {
    carImuSn: string,
    hubSn: string,
    antennaTwo: string,
    wheelImuSn: string,
    id: number | null,
    superCattleModuleInfo: string,
    sn: string,
    npn: string,
    steeringWheelSn: string,
    warrantyDate: string,
    antennaOne: string,
    type: string,
    terminalType: string,
    motorSn: string,
    expirationTime: string,
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
    data: ''
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