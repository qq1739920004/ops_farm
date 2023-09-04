// 请求
export interface HelpHandlingObj {
    key: string
    status: number | null,
    currentPage: number,
    pageSize: number,
    helpTimeOrder: number,
    handleTimeOrder: number,
    assignTimeOrder: number
}


// 响应
export interface ResponseData {
    message?: string,
    code?: number,
}

// 接收数据类型
export interface RecordsObj {
    id: number,
    tel: string,
    sn: string,
    carId: number,
    status: number,
    helpTime: string,
    handleTime: string,
    assignTime: string,
    consumeTime: number | string,
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
export interface HelpHandlingUncountData extends ResponseData {
    data: number
}

// 响应-车辆、PID、校准、参数获取
export interface HelpHandlingParamData {
    code: string,
    data: {
        carId: number,
        updateTime: number,
        createTime: number,
        paramJson: string
    }
}

// 响应-参数变更记录
export interface HelpHandlingParamChangeData extends ResponseData {
    data: {
        "0": [{
            newParam: Number,
            name: String,
            oldParam: Number
        }]
    }

}
// 响应-报警记录
export interface AlarmObj {
    records?: [{
        carId?: number;
        content?: number;
        grade?: number;
        time?: string;
    }
    ];

    total?: number;

}


export interface HelpHandlingAlarmData extends ResponseData {
    data: AlarmObj
}
// 响应-处理人列表
export interface HandlerUserVO {
    name?: string;
    tel?: string;
    handlerId: string
}

export interface HelpHandlerData extends ResponseData {
    data: HandlerUserVO[]
}

// 响应-完成处理
export interface FinishData extends ResponseData{
    data?: { [key: string]: any };
}