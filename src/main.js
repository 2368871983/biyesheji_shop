import { createApp } from 'vue'

import '@/assets/main.css'
import App from './App.vue'
import router from './router'

import '@/styles/common.less'
import pinia from './stores'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')