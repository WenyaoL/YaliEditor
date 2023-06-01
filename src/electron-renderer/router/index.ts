/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PreferenceSettingView from '../views/PreferenceSettingView.vue'
import KeybindingPanle from '../components/preference-setting/keybinding/KeybindingPanel.vue'
import GeneralPanle from '../components/preference-setting/GeneralPanel.vue'
import SystemPanle from '../components/preference-setting/SystemPanel.vue'
import LoadingView from '../views/LoadingView.vue'


export const constantRoutes = [
  {
    path: '/',
    redirect: '/loading'
  },
  {
    path: '/index.html',
    redirect: '/loading'
  },
  {
    path: '/loading',
    component: LoadingView
  }
]

export const asyncRoutes = [
  {
    path: '/home',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/preference',
    name: 'preference',
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





const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: constantRoutes as any
})


export default router
