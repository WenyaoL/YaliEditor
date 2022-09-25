/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { createRouter, createWebHistory } from 'vue-router'

import FileContentView from '../views/FileContentView'
import FolderView from '../views/FolderView'
import DesignDashboard from '../views/DesignDashboard'
import TestPanle from '../views/TestPanle'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/index.html',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: FileContentView 
  },
  {
    path: '/folder',
    name: 'folder',
    component: FolderView
  },
  {
    path: '/designDashboard',
    name: 'designDashboard',
    component: DesignDashboard
  },
  {
    path: '/test',
    name: 'testPanle',
    component: TestPanle
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
