/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { createRouter, createWebHistory } from 'vue-router'

import FileContentView from '../views/FileContentView'
import FolderView from '../views/FolderView'
import DesignDashboard from '../views/DesignDashboard'
import TestPanle from '../views/TestPanle'
import FileTree from '@/components/filetree-panel/FileTree.vue'

const routes = [
  {
    path: '/',
    redirect: '/folder'
  },
  {
    path: '/index.html',
    redirect: '/folder'
  },
  {
    path: '/folder',
    name: 'folder',
    component: FileTree
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
