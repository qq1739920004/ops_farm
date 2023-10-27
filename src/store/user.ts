import { defineStore } from 'pinia'
import { useStorage } from "@vueuse/core";
import { reactive } from 'vue'
const useUserStore = defineStore("use", () => {
    const userInfo = reactive(JSON.parse(localStorage.getItem('userInfo') || '{}'))
    let locationHrefAuthorization = location.href.split('?Authorization=')[1] || ''
    if (locationHrefAuthorization) {
        locationHrefAuthorization = locationHrefAuthorization.replace('%20', ' ')
        localStorage.setItem('Authorization', locationHrefAuthorization)
    }

    let Authorization = useStorage('Authorization', locationHrefAuthorization)

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