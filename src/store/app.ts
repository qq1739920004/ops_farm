
import { defineStore } from 'pinia'
import { useStorage } from "@vueuse/core";
import { ref } from 'vue'


const useAppStore = defineStore("app", () => {
    const defaultThemeSettings = { // 主题默认配置
        layout: 'vertical', // layout
        themeColor: '#67ae5b' // 主题颜色
    }

    const device = ref('desktop') // 屏幕类型
    const themeSettings = useStorage('themeSettings', defaultThemeSettings) as Record<string, any>


    setPrimaryColor()

    // 修改屏幕类型
    function updateDevice(arg: string) {
        device.value = arg
    }
    // 修改主题配置
    function updateThemeSettings(key: string, val: any) {
        themeSettings.value[key] = val
        setPrimaryColor()

    }

    // 设置主题颜色
    function setPrimaryColor() {
        document.documentElement.style.setProperty("--el-color-primary", themeSettings.value.themeColor);
    }

    return {
        device,
        themeSettings,
        updateDevice,
        updateThemeSettings,
    }

})
export default useAppStore