import { defineStore } from 'pinia'

let themeSettings: any = localStorage.getItem('themeSettings')
themeSettings = JSON.parse(themeSettings)
<<<<<<< HEAD
const { layout } = themeSettings ?themeSettings :''

=======
const { layout } = themeSettings || ''
>>>>>>> c39267d438b8f800a725ff8bbddc7a74da263248
const useAppStore = defineStore("app", {
    state: () => (
        {
            device: "desktop",
            // 主题配置
            themeSettings: {
<<<<<<< HEAD
                layout: layout || 'vertical' // vertical 横屏 // horizontal 竖屏
=======
                // layout: layout || 'vertical' // vertical 横屏 // horizontal 竖屏
                layout: layout || 'vertical' 
>>>>>>> c39267d438b8f800a725ff8bbddc7a74da263248
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
