import { defineStore } from 'pinia'
import { useStorage } from "@vueuse/core";
import { reactive } from 'vue'
const useUserStore = defineStore("use", () => {
    let Authorization = useStorage('Authorization', '')
    const userInfo = reactive(JSON.parse(localStorage.getItem('userInfo') || '{}'))
    function clearUserInfo() {
        Authorization.value = ''
        localStorage.removeItem("userInfo")
    }

    return {
        userInfo,
        Authorization,
        clearUserInfo
    }
})
export default useUserStore