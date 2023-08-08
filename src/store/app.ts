import { defineStore } from 'pinia'

const useAppStore = defineStore("app", {
    state: () => (
        {
            device: "desktop",
            // 主题配置
            themeSettings: {
                layout: 'vertical' // vertical 横屏 // horizontal 竖屏
            } as Record<string, any>
        }
    ),

    actions: {
        updateDevice(device: string) {
            this.device = device
        },
        updateThemeSettings(key: string, value: any) {
            this.themeSettings[key] = value
        },

    }

})

export default useAppStore
