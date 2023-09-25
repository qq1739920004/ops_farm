import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from "@vueuse/core";
const useUserStore = defineStore("use", () => {
    const Authorization = useStorage('Authorization', '')
    return {
        Authorization
    }
})
export default useUserStore