
// 导入 Element Plus 中英文语言包
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";

import { defineStore } from 'pinia'
import { useStorage, useDark, useToggle } from "@vueuse/core";
import { getLightColor, getDarkColor } from "@/utils/color";
import { ref, computed } from 'vue'
import { constantRoutes } from "@/router";


const useAppStore = defineStore("app", () => {
    const routes: any = ref([])
    const isDark = useDark();
    const layout = useStorage('layout', 'vertical')
    const themeColor = useStorage('themeColor', '#33B838')
    const device = ref('desktop') // 屏幕类型
    const language = useStorage("language", 'zh-cn');
    const locale = computed(() => {
        if (language.value == 'zh-cn') {
            return zhCn
        }
        if (language.value == 'en') {
            return en
        }
    });
    setPrimaryColor()

    // 修改路由
    function updateRoutes(arg: any) {
        routes.value = arg 
    }

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
    // 修改语言
    function updateLanguage(arg: string) {
        language.value = arg;
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
        routes,
        isDark,
        device,
        layout,
        themeColor,
        language,
        locale,
        updateRoutes,
        updateIsDark,
        updateDevice,
        updateLayout,
        updateThemeColor,
        updateLanguage
    }

})
export default useAppStore