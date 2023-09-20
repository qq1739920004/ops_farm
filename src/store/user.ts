import { defineStore } from 'pinia'
import { ref } from 'vue'
const useUserStore = defineStore("use", () => {
    const oldUserCookie = ref('')
    oldUserCookie.value = document.cookie.split('loginSysCookie=')[1].split('#').join('_')
    return {
        oldUserCookie
    }
})
export default useUserStore