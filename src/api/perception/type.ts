export interface ResponseData {
    message?: string,
    code?: number,
}
export interface geojsonObj extends ResponseData{
  data:string,
}

  export interface MonitorObj{
    todayAcDevice?: number,
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
        cityName: string,
        totalNum: number,
        onlineNum: number,
        code: string,
        name: string,
        lat:string,
        lng:string,
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
export interface StateObj{
  currentPage:number,
  pageSize:number,
}
export interface timeParams {
  st: string,
  et: string,
}
export interface recordsType
  {
    carName: string,
    code: string,
    name: string,
    onlineTime: string,
    offlineTime: string,
    sn: string,
    onlineTcp:number,
    time?:string,
    carId: number
}
// 定义一个车辆数量的类型
interface CarCount {
  activeCar: number;  // 活跃车辆数量
  totalCar: number;   // 总车辆数量
  newCar: number;     // 新增车辆数量
}

// 定义一个图表数据的类型
export interface ChartData {
  formatDate: string;  // 格式化的日期
  count: number;       // 数量
}

// 定义主数据类型
export interface CarData extends ResponseData {
  data:{
    count: CarCount;     // 车辆数量数据
    chart: ChartData[];  // 图表数据数组
  }
}
export interface StateResponseData extends ResponseData {
    data: {
      total: number,
      records: recordsType[]
        
      
    }
}
      

 