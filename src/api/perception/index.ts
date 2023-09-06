
import request from '@/utils/request'
import {monitorResponseData,StateObj,StateResponseData} from './type'
// 未处理个数
export function getMonitorAPI() {
    return request<any, monitorResponseData>({
        url: "/farm/monitor/get",
        method: 'get',
    })
}
export function getState(params:StateObj) {
    return request<StateObj, StateResponseData>({
        url: "/farm/monitor/monitor/carLog",
        method: 'get',
        params
    })
}
export function getStateWs(resList: any) {
  //获取cookie
  let cookie =document.cookie.split('loginSysCookie=')[1].split('#').join('_')
  console.log(cookie);
  let wsUrl=''
  //查看当前环境
  if(!import.meta.env.DEV){
    wsUrl=`ws://140.207.166.210:9034/websocket?token=${cookie}`
  }else{
    wsUrl=`wss://cloud.sinognss.com/websocket?token=${cookie}`

  }
const ws = new WebSocket(wsUrl);


// 监听 WebSocket 连接成功事件
ws.addEventListener('open', () => {
  console.log('WebSocket 连接已建立');
  // 在这里可以发送消息或执行其他操作
});

// 监听 WebSocket 接收消息事件
ws.addEventListener('message', (event) => {
  console.log(event.type);
  // 处理接收到的消息
  if(event.type=="monitor"){
    resList.value.push(event.data)
    console.log(event.data);
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
