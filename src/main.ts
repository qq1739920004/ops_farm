// import { createApp } from 'vue'
// import App from '@/App.vue'
// const app = createApp(App)

import '@/styles/index.scss'
import '@/views/perception/perception.scss'
// 本地SVG图标
import 'virtual:svg-icons-register';

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css';

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { app } from '@/store'
import router from '@/router'
import i18n from '@/lang'
import '@/utils/permission'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
app.use(ElementPlus)
app.use(i18n)
app.mount('#app')



