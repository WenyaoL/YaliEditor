import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//import 'bootstrap/dist/css/bootstrap.min.css'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
import '@/assets/icon.css'


const app =  createApp(App)

app.use(ElementPlus)
        .use(store)
        .use(router)
        .use(ContextMenu)
        .mount('#app')

