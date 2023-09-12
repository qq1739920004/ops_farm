export interface ResponseData {
    message?: string,
    code?: number,
}
export interface timeParams {
  st: string,
  et: string,
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