import { createRouter, createWebHistory } from 'vue-router'

import FileContentView from '../views/FileContentView'
import FolderView from '../views/FolderView'
import DesignDashboard from '../views/DesignDashboard'
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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
