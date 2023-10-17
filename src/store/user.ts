import { defineStore } from 'pinia'
import { useStorage } from "@vueuse/core";
import { reactive } from 'vue'
const useUserStore = defineStore("use", () => {
    let Authorization = useStorage('Authorization', '')
    const userInfo = reactive(JSON.parse(localStorage.getItem('userInfo') || '{}'))

    function logOut() {
        Authorization.value = ''
        location.href = '/'
    }

    return {
        userInfo,
        Authorization,
        logOut
    }
})
export default useUserStore