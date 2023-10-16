import { defineStore } from 'pinia'
import { ref } from 'vue'
import useUserStore from '@/store/user'
const userStore = useUserStore()
const useSocketStore = defineStore("socket", () => {
    let ws: any = null
    let socketData = ref({})
    function connect() {
        ws = new WebSocket(`ws://${import.meta.env.VITE_APP_BASE_WSURL}/websocket?Authorization=${userStore.Authorization}`);
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
    function close() {
        ws.close()
    }

    return {
        socketData,
        connect,
        close
    }


})



export default useSocketStore