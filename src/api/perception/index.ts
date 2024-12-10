
import request from '@/utils/request'
import {monitorResponseData,StateObj,timeParams,StateResponseData,geojsonObj,CarData} from './type'
// 未处理个数
export function getMonitorAPI() {
    return request<any, monitorResponseData>({
        url: "/farm/monitor/get",
        method: 'get',
    })
}
export function getGeo_API(val:any) {
  return request<any,any>({
    url:`/farm/monitor/country/geo?num=${val}`,
    method:'get'
  })
}
export function getMonitorSea_API() {
  return request<any, any>({
    url: "/farm/monitor/sea/get",
    method: 'get',
})
}
export function getGeojson(keyWord:string) {
  return request<any, geojsonObj>({
    url: "/farm/monitor/geo",
    method: 'get',
    params: {
      addrCodes:keyWord
    }
    
  })
}
export function getState(params:StateObj) {
    return request<StateObj, StateResponseData>({
        url: "/farm/monitor/carLog",
        method: 'get',
        params
    })
}
export async function getWeather(){
  return new Promise((resolve,reject)=>{
  // try {
  //   const response = await fetch('https://ipinfo.io/json');
  //   const data = await response.json();
  //   let loc = data.loc
  //  return await getWeatherData(loc)
  // } catch (error) {
  //   console.error("获取经纬度出错，获取天气失败", error);
  //   return null; // 优雅地处理错误
  // }
  // 使用HTML5 Geolocation API获取用户的经纬度
if ("geolocation" in navigator) {  // 检查浏览器是否支持Geolocation API
  navigator.geolocation.getCurrentPosition(async function(position) {
    // 获取成功时执行的函数
    var latitude = position.coords.latitude;   // 获取纬度
    var longitude = position.coords.longitude; // 获取经度
    let res= await getWeatherData(longitude+','+latitude)
    resolve(res)
  }, function(error) {
    // 获取失败时执行的函数
    let err="获取位置信息失败: " + error.message
    console.error(err);
    reject(err)
  });
} else {
  let err="浏览器不支持Geolocation API"
  console.error(err);
  reject(err)

}
})
}
function getWeatherData(location: string) {
  return request<any, any>({
    url:"/farm/monitor/weather",
    method:'get',
    params:{
      dataType:0,
      addrCode:location
    }
  })
}
export function getUserAuth(){
  return request<any, any>({
    url:"/auth/user/getCurrentUser",
    method:'get',
  })
}
//活跃度查询
export function getActiveData(params:timeParams) {
  return request<timeParams, CarData>({
    url: "/farm/stat/car",
    method: 'get',
    params
  })
}


export function getStateWs(resList: any) {
  //获取cookie
  let cookie =document.cookie.split('loginSysCookie=')[1].split('#').join('_')
  let wsUrl=''

  //查看当前环境
  let currentUrl = window.location.href
  if(!currentUrl.includes('cloud.sinognss')){
    wsUrl=`ws://140.207.166.210:9034/websocket?token=${cookie}`
  }else{
    wsUrl=`wss://cloud.sinognss.com/websocket?token=${cookie}`
  }
const ws = new WebSocket(wsUrl);


// 监听 WebSocket 连接成功事件
ws.addEventListener('open', () => {
  // 在这里可以发送消息或执行其他操作
});

// 监听 WebSocket 接收消息事件
ws.addEventListener('message', (event) => {
  // 处理接收到的消息
  if(event.type=="monitor"){
    resList.value.push(event.data)
  }
  
  // console.log('接收到数据:', receivedData);
});

// 监听 WebSocket 连接关闭事件
ws.addEventListener('close', () => {
  console.log('WebSocket 连接已关闭');
});

// 监听 WebSocket 连接错误事件
ws.addEventListener('error', (error) => {
  console.error('WebSocket 连接发生错误:', error);
});
}

