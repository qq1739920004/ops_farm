export interface ResponseData {
    message?: string,
    code?: number,
}

export interface PageObj {
    companyId: number | string,
    carId: number | string,
    currentPage: number,
    pageSize: number,
    st?: string,
    et?: string,
    name: string
}

export interface paddyWorkObj {
    id: number,
    name: string,
    workType: number,
    workedArea: number,
    createtime: string,
    updatetime: string,
    position: string,
    sn: string,
    npn: string,
    carName: string,
    toolName: string,
    userName: string,
    lineptax: number,
    lineptay: number,
    lineptah: number,
    lineptbx: number,
    lineptby: number,
    lineptbh: number,
    workmode: number,
    workpoints: string,
    curvepointsnum: number,
    bendpointsnum: number,
    startpoint: number,
    endpoint: number,
    baseline: number,
    direction: number,
    minradius: number,
    checked?: boolean
}

export interface paddyWorkListResponsenumber extends ResponseData {
    data: {
        total: number,
        records: paddyWorkObj[]
    }
}

export interface dealerCarObj {
    id: number,
    nameNpn: string,
    sn: number
}
export interface dealerCarResponseData extends ResponseData {
    data: dealerCarObj[]
}