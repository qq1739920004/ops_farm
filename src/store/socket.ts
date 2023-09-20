import { defineStore } from 'pinia'
import { ref } from 'vue'



const useSocketStore = defineStore("socket", () => {

    let ws: any = null
    let socketData = ref({})
    let cookie = 'b5e11a57-ea28-49b8-adbe-7ed0aa8c2aa8_wdl_42_3'

    function connect() {
        ws = new WebSocket(`ws://${import.meta.env.VITE_APP_BASE_WSURL}/websocket?token=${cookie}`);
        ws.onopen = () => {
            // console.success('连接成功');
        };
        ws.onmessage = (e: any) => {
            const data = JSON.parse(e.data);
            socketData.value = data
        };
        ws.onclose = () => {
            console.log('连接关闭');
        };
    }

    return {
        socketData,
        connect
    }


})



export default useSocketStore