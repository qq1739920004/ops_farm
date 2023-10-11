import { defineStore } from 'pinia'
import { useStorage } from "@vueuse/core";
const useUserStore = defineStore("use", () => {
    let Authorization = useStorage('Authorization', '')


    function logOut() {
        Authorization.value = ''
        location.href = '/'
    }

    return {
        Authorization,
        logOut
    }
})
export default useUserStore