<template>
  <el-menu
    default-active="1"
    class="el-menu-vertical-demo"
    
    :collapse="isCollapse"
  > 
    <el-menu-item index="1" @click="toRouteOutline">
      <el-icon><Notebook /></el-icon>
      <template #title>大纲</template>
    </el-menu-item>
    <el-menu-item index="2" @click="toRouteFolder">
      <el-icon><folder /></el-icon>
      <template #title>文件夹</template>
    </el-menu-item>
    <el-menu-item index="3" @click="toRouteHelp">
      <el-icon><QuestionFilled /></el-icon>
      <template #title>关于</template>
    </el-menu-item>

    <el-menu-item index="4"  @click="toRouteDesignDashboard">
      <el-icon><setting /></el-icon>
      <template #title>设置</template>
    </el-menu-item>



    <el-menu-item index="5" @click="fold">
      <el-icon v-show="isFold"><ArrowRightBold /></el-icon>
      <el-icon v-show="!isFold"><ArrowLeftBold /></el-icon>
      <template #title>折叠</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Folder,
  Setting,
  QuestionFilled,
  ArrowLeftBold,
  ArrowRightBold,
  Notebook
} from '@element-plus/icons-vue'
import {ref} from 'vue'
import {useStore} from 'vuex'
import router from "@/router";

let isCollapse = ref(true)
let isRoute = ref(true)
const store = useStore()
let isFold = ref(store.state.sideBarFold)

const fold = function(e){  
  isFold.value = !isFold.value
  store.commit("updateSideBarFold",isFold.value)
  //router.push("/outline")
}

//手动路由，不使用组件内部的路由，避免BUG
const toRouteOutline = ()=>router.push("/outline")
const toRouteFolder = ()=>router.push("/folder")
const toRouteHelp = ()=>router.push("/test")
const toRouteDesignDashboard = ()=>router.push("/designDashboard")

</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  /*min-height: 600px;*/
}
.el-menu-vertical-demo{
  height: 100%;
}

</style>