
// 导入 Element Plus 中英文语言包
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import ja from "element-plus/es/locale/lang/ja";
import { defineStore } from 'pinia'
import { useStorage, useDark, useToggle } from "@vueuse/core";
import { getLightColor, getDarkColor } from "@/utils/color";
import { ref, computed } from 'vue'

let navigatorLanguage = navigator.language;
if (navigatorLanguage == 'zh' || navigatorLanguage == 'zh-CN') {
    navigatorLanguage = 'zh'
}
else if (navigatorLanguage.includes('ja')) {
    navigatorLanguage = 'jp'
}

else {
    navigatorLanguage = 'en'
}

const useAppStore = defineStore("app", () => {
    const isDark = useDark();
    const layout = useStorage('layout', 'vertical')
    const themeColor = useStorage('themeColor_farm', '#33B838')
    const device = ref('desktop') // 屏幕类型
    const language = useStorage("language", navigatorLanguage);
    const locale = computed(() => {
        if (language.value == 'zh') {
            return zhCn
        }
        if (language.value == 'en') {
            return en
        }
        if (language.value == 'jp') {
            return ja
        }
    });
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
        isDark,
        device,
        layout,
        themeColor,
        language,
        locale,
        updateIsDark,
        updateDevice,
        updateLayout,
        updateThemeColor,
        updateLanguage
    }

})
export default useAppStore