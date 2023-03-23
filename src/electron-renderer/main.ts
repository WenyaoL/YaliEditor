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


const app =  createApp(App)


global.yaliEditor={}
       


async function bootstarp() {
    //获取参试
    const params = new URLSearchParams(location.search)
    const type = params.get('type')
    global.yaliEditor.type = type

    global.yaliEditor.locale = await window.electronAPI.INVOKE.getCurrLocale()

    const store = (await import('./store')).default
    const i18n = (await import('./vue-i18n')).default
    const router = (await import('./router')).default
    const RendererIPMEventLoader = (await import('./ipc/RendererIPMEventLoader')).default

    router.isReady().then(() => {
        let loader =  new RendererIPMEventLoader(store)
        loader.init()
    })

    return {store,router,i18n}
}


bootstarp().then(({store,router,i18n})=>{
    app.use(ElementPlus)
        .use(store)
        .use(router)
        .use(i18n)
        .use(ContextMenu)
    app.mount('#app')
})


        


