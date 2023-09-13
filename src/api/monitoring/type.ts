export interface onlineFarmMachinePosition_type {
    name?: string;
}

export interface driveStatusPathObj {
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
    headingOffset: number,
    netSignal: number,
    gnssTime: number,
    diffAge: number,
    dirSolState: number,
    cardUsage: number,
    sn: string,
    xoffset: number
}
export interface driveStatusPathResponseData {
    message: string,
    code: number,
    data: {
        list: driveStatusPathObj[],
        judgeLevel: string
    }
}

export interface paramsObj {
    st: string,
    et: string,
    sn: string
}
export interface driveTendenctResponseData {
    message: string,
    code: number,
    data: driveStatusPathObj[]
}
