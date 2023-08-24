export interface ResponseData {
    message?: string,
    code?: number,
}

export interface groupListDataObj {
    addrcode: string,
    currentPage: number,
    pageSize: number,
    name?: string
}
export interface groupListObj {
    id: number,
    sn: string,
    carName: string,
    terminalType: string,
    distance: null,
    paddyWorks: [
        {
            id: 220,
            carid: 11114,
            paddyid: null,
            name: string,
            lineptax: 0.0,
            lineptay: -3320534.0,
            lineptah: null,
            lineptbx: 0.0,
            lineptby: -3320523.8,
            lineptbh: null,
            updatetime: string,
            createtime: string,
            workedarea: number,
            worktype: number,
            heading: null,
            beforearea: null,
            toolname: null,
            borderpoints: number[]
            ptalng: 40.0,
            ptalat: 30.0,
            ptblng: 40.0,
            ptblat: 30.0,
            radius: null,
            position: string
            workmode: null,
            workpoints: null,
            curvepointsnum: null,
            bendpointsnum: null,
            startpoint: null,
            endpoint: null,
            baseline: null,
            direction: null,
            minradius: null,
            paddyWorkId: null,
            toolParam: null,
            province: null,
            addrcode: number
        }
    ]
}
export interface groupListResponseData extends ResponseData {
    data: {
        id: number,
        sn: string,
        carName: string,
        terminalType: string,
        distance: null,
        paddyWorks: groupListObj[]
    }[]
}