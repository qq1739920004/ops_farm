export interface ResponseData {
    message?: string,
    code?: number,
}
export interface timeParams {
  st: string,
  et: string,
}
export interface getStatisticsReportcarjobAPIResponse extends ResponseData{
  data: {
    count: {
        allCarSum: number;
        onlineCarSum: number;
        workedAreaSum: number;
    };
    rank: {
        name: string;
        onlineCarCount: number;
        allCarCount: number;
        ratio: string;
        workedArea: number;
    }[];
};
}
export interface getStatisticsReportnetworkAPIResponse extends ResponseData{
  data: {
    onlineFarmMachines: {
        id: null | number;
        deviceId: number;
        posX: number;
        posY: number;
        posZ: number;
        coordType: string;
        solStat: number;
        heading: number;
        speed: number;
        driveState: number;
        satNum: number;
        baseDist: number;
        diffSource: number;
        xOffset: number;
        headingOffset: number;
        netSignal: number;
        gnssTime: number;
        diffAge: number;
        dirSolState: number;
        cardUsage: null | any;
        sn: string;
        carId: number;
        carName: string;
        carOwnerName: string;
        companyName: string;
        companyId: number;
        judgeLevel: null | any;
        judgeLevelRatio: null | any;
        lateralOffset: number;
        version: null | any;
        type: null | any;
        tel: string;
        terminalType: string;
        addrcode: string;
        creatorId: number;
        distance: null | any;
        sunFlowerSn: null | any;
        superCattleModuleInfo: null | any;
        npn: null | any;
    }[];
};
}
export interface getStatisticsStatAPIResponse extends ResponseData{
  data: {
    count: {
        farmMonitor: number;
        allFarmMonitor: number;
        allCarList: number;
        carList: number;
    };
    chart: {
        data: number[][];
        date: string[];
    };
};
}
export interface getStatisticsRemoteAPIResponse extends ResponseData {
  data: {
      count: {
          remoteCalib: number;
          dataChain: number;
          allWxMiniVisit: number;
          allDataChain: number;
          wxMiniVisit: number;
          allRemoteCalib: number;
          allRegister: number;
          register: number;
      };
      chart: {
          data: number[][];
          date: string[];
      };
  };
};
export interface getStatisticsWxAPIResponse extends ResponseData{
  data: {
      count: {
          allParamSync: number;
          paramSync: number;
      };
      chart: {
          data: number[];
          date: string[];
      };
  };
};
export interface FarmMachineObj{
    workArea: {
        todayArea: number,
        totalArea: number
    },
    car: {
        newCar: number
    },
    device: {
        totalDevice: number,
        onlineDevice: number
    },
    provinceRank: [
        {
            code: number,
            name: string,
            online: number,
            rank: string
        },   {
            code: number,
            name: string,
            online: number,
            rank: string
        }
        ,
        {
            code: number,
            name: string,
            online: number,
            rank: string
        }
    ]
}

// 接收数据类型
export interface FarmMachineResponseData extends ResponseData{
    data:FarmMachineObj
}