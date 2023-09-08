export interface ResponseData {
    message?: string,
    code?: number,
}

export interface paramDescribeObj {
    version: string,
    type: string,
    paramType: string
}

export interface paramDescribeResponseData extends ResponseData {
    data: {
        id: Number,
        version: Number,
        type: Number,
        createTime: Number,
        paramJson: string
    } | null
}

export interface carParamsDataRangObj {
    name: string,
    value: number
}
// 参数数组转换
// export interface carParamsDataObj {
//     name: string,
//     range: string | carParamsDataRangObj[],
//     type: string
// }
// 车辆参数
export interface paramsParamObj {
    Vehicle1: string,
    Vehicle10: number,
    Vehicle11: number,
    Vehicle12: number,
    Vehicle13: number,
    Vehicle14: string,
    Vehicle2: string,
    Vehicle3: number,
    Vehicle4: string,
    Vehicle5: string,
    Vehicle6: number,
    Vehicle7: number,
    Vehicle8: number,
    Vehicle9: number,
}
export interface paramCarParamResponseData extends ResponseData {
    data: {
        carId: number,
        updateTime: number,
        createTime: number,
        paramJson: string
    }
}
export interface updateInfoObj {
    carId: string,
    paramJson: string
}
//校准参数
export interface CalibParamsDataObj {
    Just1: number,
    Just2: number,
    Just3: number,
    Just7: number,
    Just8: number,
    Just9: number
}
export interface paramcalibParamData extends ResponseData {
    data: {
        carId: number,
        updateTime: number,
        createTime: number,
        paramJson: string
    }
}
export interface paramAdvanced1ParamData extends ResponseData {
    data: paramcalibParamData
}
// 获取源节点参数
export interface paramSourceNodeREsponseData extends ResponseData {
    data: string[]
}
export interface SourceObj {
    workPattern: string,
    insideHost: string,
    insidePort: number
}
export interface chaFenObj {
    codePower: boolean
    companyName: null | string
    deviceId: number
    expirationTime: string
    extendHost: null | string
    extendPassword: null | string
    extendPort: null | number
    extendSourceNode: null | string
    extendUsername: null | string
    id: number
    insideHost: string
    insidePassword: string
    insidePort: number
    insideSourceNode: null | string
    insideUsername: string
    isTransfer?: false
    lastOnlineTime: string
    model: string
    name: string
    netDate: string
    npn: string
    protocol: null | number
    province: string
    radioChannel: null | number
    radioPower: null | number
    radioStatus: null | number
    satelliteDate: string
    satelliteStatus: null | number
    sn: string
    softwareVersion: string
    tel: null | string
    terminalType: string
    type: number
    userName: null | string
    version: number
    warrantyDate: string
    workPattern: number


}
export interface chafenListResponseData extends ResponseData {
    data: {
        total: number,
        records: chaFenObj[]
    }
}
// 更新差分设置宠参数
export interface updateCarResponseData extends ResponseData {
    data: string | null
}
export interface updateCarObj {
    id: number,
    workPattern: string,
    insideHost?: string,
    insidePort?: number,
    insideSourceNode?: string | null,
    insideUsername?: string,
    insidePassword?: string,
    protocol?: number,
    radioChannel?: number,
    radioStatus?: number,
    radioPower?: number,
}
export interface carProductpackageObj {
    pid: string,
    versionType: string
}
export interface GetcarProductpackageObj {
    id: number,
    pid: number,
    ppid: string,
    versionName: string,
    versionCode: number,
    versionType: number,
    upType: number,
    packType: number,
    filename: string,
    filepath: string,
    filesize: number,
    uptime: string,
    creatorid: number,
    remark: string,
    enable: false,
    modelRelated: string,
    downloads: number,
    publishCount: number,
    createType: number,
    productName: string,
    creatorName: string,
    modelPackageList: [
        {
            id: number,
            mid: number,
            versionName: string,
            versionCode: number,
            filename: string,
            filepath: string,
            filesize: number,
            uptime: string,
            creatorid: number,
            remark: string,
            enable: false,
            publishCount: number,
            downloads: number,
            creatorName: string,
            type: string,
            modelName: string
        }
    ]
}
export interface GetcarProductpackageResponseData extends ResponseData {
    data: GetcarProductpackageObj[]
}
// 在线升级参数更新
export interface CarpackageUpgradeInfoObj {
    installPackageId: number,
    sn: string,
    updateModel?: string,
    upgradeWay: number
}
