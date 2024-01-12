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
export interface onlineMaker {
	id?: any;
	deviceId?: any;
  action:string;
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
	cardUsage: number;
	sn: string;
	workName?: any;
	carId: number;
	carName: string;
	carOwnerName: string;
	companyName: string;
	companyId: number;
	judgeLevel?: any;
	judgeLevelRatio?: any;
	lateralOffset: number;
	version: number;
	type: number;
	tel: string;
	terminalType: string;
	addrcode: string;
	creatorId: number;
	distance?: any;
	sunFlowerSn?: any;
	npn: string;
  markerId?:string;
  markerLng?:number;
  markerLat?:number;
  markerType?:string;
  markerIcon?:string;
  markerPopup?:string;
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
    carId: number,
    deviceSn:string,
    position:string,
    judgeLevel?:string,
    userNameCar:string
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
      

 