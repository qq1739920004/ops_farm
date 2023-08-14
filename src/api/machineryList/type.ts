export interface ResponseData {
    message?: string,
    code?: number,
}
// 分页type

export interface pageInfo {
    key: string,
    currentPage: number,
    pageSize: number,
    companyId: string,
    order: string
}
export interface newListObj {
    id: number,
    npn: string,
    sn: string,
    name: string,
    userName: string,
    model: string,
    province: string,
    terminalType: string,
    expirationTime: string,
    warrantyDate: string,
    satelliteDate: string,
    netDate: string,
    lastOnlineTime: string,
    companyName: string,
    satelliteStatus: number,
    codePower: boolean,
    isTransfer: Boolean,
    version: number,
    type: number,
    onlineTcp: number,
    driveState: number,
    factory: string,
    age: number,
    creatorName: string,
    creatorTel: string,
    sunFlowerSn: string,
    softwareVersion: string,
    createTime: string,
    updateTime: string,
    lastAutoDriveTime: string,
    tel: string
}

export interface carNewListResponseData extends ResponseData {
    data: {
        total: number,
        records: newListObj[]
    }
}

// 车辆详情type

export interface carNewDetailObj {
    id: number,
    npn: string,
    sn: string,
    name: string,
    userName: string,
    model: string,
    province: string,
    terminalType: string,
    expirationTime: string,
    warrantyDate: string,
    satelliteDate: string,
    netDate: string,
    lastOnlineTime: string,
    companyName: string,
    satelliteStatus: number,
    codePower: boolean,
    isTransfer: boolean,
    version: number,
    type: number,
    onlineTcp: number,
    driveState: number,
    factory: string,
    age: number,
    creatorName: string,
    creatorTel: string,
    sunFlowerSn: string,
    softwareVersion: string,
    createTime: string,
    updateTime: string,
    lastAutoDriveTime: string,
    tel: string
}
export interface carNewDetailResponseData extends ResponseData {
    data: carNewDetailObj
}