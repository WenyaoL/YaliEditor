import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//import 'bootstrap/dist/css/bootstrap.min.css'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
import './assets/icon.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/theme/dark.scss'
import './assets/hljs/github.scss'
import store from './store'
import i18n from './vue-i18n'
import router from './router'
import RendererIPMEventLoader from './ipc/RendererIPMEventLoader'

const app =  createApp(App)


global.yaliEditor={}
       


async function bootstarp() {
    const start = Date.now()
    //获取参试
    const params = new URLSearchParams(location.search)
    let type = params.get('type')
    if(type == null) type = 'home'
    global.yaliEditor.type = type
    global.yaliEditor.locale = await window.electronAPI.INVOKE.getCurrLocale()
    store.dispatch('updateI18nLocale',global.yaliEditor.locale)
    router.isReady().then(() => {
        let loader =  new RendererIPMEventLoader(store)
        loader.init()
    })
    app.use(store)
        .use(router)
        .use(i18n)
    return 
}


bootstarp().then(()=>{
    app.use(ElementPlus)
        .use(ContextMenu)
    app.mount('#app')

    store.dispatch('generateRoutes',global.yaliEditor.type)
    .then((routes:[])=>{
        routes.forEach(route=>{
            router.addRoute(route)
        })
        if (routes.length>0) {
            router.push(global.yaliEditor.type)
        }
    })
})


        


