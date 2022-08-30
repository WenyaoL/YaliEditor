import { createRouter, createWebHistory } from 'vue-router'

import FileContentView from '../views/FileContentView'
import FolderView from '../views/FolderView'
import TestPanle from '../views/TestPanle'
import YaLiTestPanle from '../views/YaLiTestPanle'
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
    path: '/test',
    name: 'testPanle',
    component: TestPanle
  },
  {
    path: '/testYaLi',
    name: 'testYaLi',
    component: YaLiTestPanle
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
