import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from "@tanstack/vue-query";
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'normalize.css'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(VueQueryPlugin)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')
