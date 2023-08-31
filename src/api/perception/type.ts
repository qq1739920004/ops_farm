export interface ResponseData {
    message?: string,
    code?: number,
}


  export interface MonitorObj{
    
    onlineDevice: number,
    addNowYearDevice: number,
    totalDevice: number,
    activeDevice: number,
    todayArea: number,
    totalArea: number,
    typeCounts: [
      {
        typeName: string,
        onlineCount: number,
        totalCount: number
      }
    ],
    provinceCars: [
      {
        name: string,
        totalNum: number,
        onlineNum: number
      }
    ],
    carAreas: [
      {key: number}
  ]
  
  }

  // 接收数据类型
export interface monitorResponseData extends ResponseData {
  data:MonitorObj
  }
      

 