import App from '@/App.vue'
import { createPinia } from 'pinia';
import { createApp } from 'vue'

export const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

