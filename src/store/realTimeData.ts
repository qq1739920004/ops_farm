import { defineStore } from 'pinia'
type realTimeType={
    realTimeData: any,
    realTimeDataArea: any,
    realTimeDataActive: any,
    ws: WebSocket | null
}
const realTimeStore = defineStore("realTime", {
   state: ():realTimeType => ({
      realTimeData: {},
      realTimeDataArea: {},
      realTimeDataActive: {},
      ws: null,
   }),
   //websocket接收实时数据
    actions: {
        startRealTimeData() {
      // let cookie =document.cookie.split('loginSysCookie=')[1].split('#').join('_')
          let auth=localStorage.getItem('Authorization') || ''
          this.ws = new WebSocket(`${window.CONFIG_BASE_WS}?token=${auth}`);
          this.ws.onopen = () => {
              console.log('连接成功');
          };
          this.ws.onmessage = (e) => {
              const data = JSON.parse(e.data);
              if(data.type=="monitor"){
                this.realTimeData = data.data
              }
              else if(data.type=="monitorArea"){
                this.realTimeDataArea = data.data
              }
              else if(data.type=="monitorCarNum"){
                this.realTimeDataActive = data.data
              }
          };
          this.ws.onclose = () => {
              console.log('连接关闭');
          };
        },
        //关闭websocket
        closeRealTimeData() {
          if (this.ws) {
            this.ws.close();
            console.log('WebSocket已关闭');
        } 
        }

    },
})

export default realTimeStore