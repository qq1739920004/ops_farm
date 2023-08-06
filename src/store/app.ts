import { defineStore } from 'pinia'

const useAppStore = defineStore("app", {
    state: () => (
        {
            device: "desktop",
            themeSettings: {
                navigation: 'left'
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
