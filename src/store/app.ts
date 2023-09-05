
import { defineStore } from 'pinia'
import { useStorage, useDark, useToggle } from "@vueuse/core";
import { getLightColor, getDarkColor } from "@/utils/color";
import { ref } from 'vue'

const useAppStore = defineStore("app", () => {
    const isDark = useDark();
    const layout = useStorage('layout', 'vertical') 
    const themeColor = useStorage('themeColor', '#67ae5b')
    const device = ref('desktop') // 屏幕类型

    setPrimaryColor()

    // 修改layout 
    function updateLayout(arg: string) {
        layout.value = arg
    }

    // 修改主题颜色
    function updateThemeColor(arg: string) {
        themeColor.value = arg
        setPrimaryColor()
    }

    // 修改屏幕类型
    function updateDevice(arg: string) {
        device.value = arg
    }
    //修改暗黑模式
    function updateIsDark() {
        useToggle(isDark)
        setPrimaryColor()
    }

    // 设置主题颜色
    function setPrimaryColor() {
        const val = themeColor.value
        document.documentElement.style.setProperty("--el-color-primary", val);
        document.documentElement.style.setProperty(
            "--el-color-primary-dark-2",
            isDark.value ? `${getLightColor(val, 0.2)}` : `${getDarkColor(val, 0.3)}`
        );
        for (let i = 1; i <= 9; i++) {
            const primaryColor = isDark.value ? `${getDarkColor(val, i / 10)}` : `${getLightColor(val, i / 10)}`;
            document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, primaryColor);
        }
    }

    return {
        isDark,
        device,
        layout,
        themeColor,
        updateIsDark,
        updateDevice,
        updateLayout,
        updateThemeColor
    }

})
export default useAppStore