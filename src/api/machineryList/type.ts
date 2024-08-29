export interface ResponseData {
    message?: string,
    code?: number,
}
// 分页type

export interface pageInfo {
    key?: string,
    currentPage: number,
    pageSize: number,
    companyId?: number | string,
    order: string,
    cityCode?: string,
    provinceCode?: string
    activationStatus?:any
    terminalType?:any
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
    tel: string,
    workPattern: number,
    protocol: number,
    radioChannel: number,
    radioStatus: number,
    radioPower: number,
    insideHost: string,
    insidePort: number,
    insideSourceNode: string,
    insideUsername: string,
    insidePassword: string,
    extendHost: string,
    extendPort: number,
    extendSourceNode: string,
    extendUsername: string,
    extendPassword: string,
    deviceId: number,
    openRemote?: boolean
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
    sn: string,
    name: string,
    companyName: string,
    userName: string,
    tel?: string,
    model: string,
    lastOnlineTime: string,
    lastAutoDriveTime: string,
    board: string,
    ec20: string,
    radioStation: string,
    carImu: string,
    carImuSn: string,
    wheelImu: string,
    wheelImuSn: string,
    motor: string,
    motorSn: string,
    steeringWheel: string,
    steeringWheelSn: string,
    hubBluetooth: string,
    hub: string,
    hubSn: string,
    expirationTime: string,
    warrantyDate: string,
    netDate: string,
    satelliteDate: string,
    p300Version: string


}
export interface carNewDetailResponseData extends ResponseData {
    data: carNewDetailObj
}
export interface carDealerObj {
    id: number | string,
    name: string
}
export interface carDealerResponseData extends ResponseData {
    data: carDealerObj[]
}
// 控制星基开关参数
export interface carStatusObj {
    ids: number[],
    commandType: number,
    commandStatus: number
}
export interface activationCodeObj {
    oemSn: string,
    date: number,
    carId: number,
    deviceId: number
}
// 地图参数
export interface PageInfoObj {
    sn: string,
    npn: string,
    st: string,
    et: string
}
export interface singleCarTrackResponseData extends ResponseData {
    data: singleCarTrackObj[]
}
export interface singleCarTrackObj {
    id: number,
    deviceId: number | null,
    posX: number,
    posY: number,
    posZ: number,
    coordType: string,
    solStat: number,
    heading: number,
    speed: number,
    driveState: number,
    satNum: number,
    baseDist: number,
    diffSource: number,
    gnssTime: number,
    diffAge: number,
    dirSolState: number,
    cardUsage: number,
    sn: string,
    workName: string | null,
    npn: string
}
export interface ChildrenFileListResponseData extends ResponseData {

}