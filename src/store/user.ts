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
    let refresh_token = useStorage('refresh_token', '')

    function updateAuthorization(arg: string) {
        Authorization.value =arg
    }
    function updateRefreshToken(arg: string) {
        refresh_token.value = arg
    }

    function clearUserInfo() {
        Authorization.value = ''
        localStorage.removeItem("userInfo")
    }
    
    return {
        userInfo,
        Authorization,
        refresh_token,
        updateAuthorization,
        updateRefreshToken,
        clearUserInfo
    }
})
export default useUserStore