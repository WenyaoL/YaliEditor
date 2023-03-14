/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PreferenceSettingView from '../views/PreferenceSettingView.vue'
import KeybindingPanle from '../components/preference-setting/KeybindingPanel.vue'
import GeneralPanle from '../components/preference-setting/GeneralPanel.vue'
import SystemPanle from '../components/preference-setting/SystemPanel.vue'

function getRoutes(type):any[] {
  return [
    {
      path: '/',
      redirect: type == 'preference' ? '/preference' : '/home'
    },
    {
      path: '/index.html',
      redirect: type == 'preference' ? '/preference' : '/home'
    },
    {
      path: '/home',
      component: HomeView
    },
    {
      path: '/preference',
      component: PreferenceSettingView,
      children:[
        {
          path:'',
          component:KeybindingPanle
        },
        {
          path:'keybinding',
          component:KeybindingPanle
        },
        {
          path:'general',
          component:GeneralPanle
        },
        {
          path:'system',
          component:SystemPanle,
        }
      ]
    }
  ]
}


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: getRoutes(global.yaliEditor.type)
})


export default router
