import { createApp } from 'vue'
import App from '@/App.vue'

import '@/styles/index.scss'
import '@/views/perception/perception.scss'
// 本地SVG图标
import 'virtual:svg-icons-register';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css';
import router from '@/router'

import { createPinia } from 'pinia'

import i18n from '@/lang'
// import * as L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet.pm";
// import "leaflet.pm/dist/leaflet.pm.css";


const pinia = createPinia()
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(pinia)
app.use(ElementPlus)
app.use(i18n)
app.mount('#app')
