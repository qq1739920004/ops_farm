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
export interface carParamsDataObj {
    name: string,
    range: string | carParamsDataRangObj[],
    type: string
}
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
    updateTime: number,
    createTime: number,
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