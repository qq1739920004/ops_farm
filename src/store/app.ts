import { defineStore } from 'pinia'

let themeSettings: any = localStorage.getItem('themeSettings')
themeSettings = JSON.parse(themeSettings)

const { layout } = themeSettings || ''

const useAppStore = defineStore("app", {
    state: () => (
        {
            device: "desktop",
            // 主题配置
            themeSettings: {
                layout: layout || 'vertical' // vertical 横屏 // horizontal 竖屏 
            } as Record<string, any>
        }
    ),

    actions: {
        updateDevice(device: string) {
            this.device = device
        },
        updateThemeSettings(key: string, value: any) {
            this.themeSettings[key] = value
            localStorage.setItem('themeSettings', JSON.stringify(this.themeSettings))
        },

    }

})

export default useAppStore
