<template>
  <el-menu
    default-active="1"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
  > 
    <el-menu-item index="1" @click="changePanel('ContextOutline')">
      <el-icon><Notebook /></el-icon>
      <template #title>{{ $t('leftMenu.catalogue') }}</template>
    </el-menu-item>
    <el-menu-item index="2" @click="changePanel('FileTree')">
      <el-icon><folder /></el-icon>
      <template #title>{{ $t('leftMenu.folder') }}</template>
    </el-menu-item>

    <el-menu-item index="3" @click="changePanel('RecentDocuments')">
      <el-icon><Document /></el-icon>
      <template #title>{{ $t('leftMenu.recentDocuments') }}</template>
    </el-menu-item>

    <el-menu-item index="4" @click="fold">
      <el-icon v-show="sideBarFlag=='fold'"><Expand /></el-icon>
      <el-icon v-show="sideBarFlag=='expand'"><Fold /></el-icon>
      <template #title>{{ $t('leftMenu.fold') }}</template>
    </el-menu-item>


  </el-menu>
</template>

<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Folder,
  Fold,
  Expand,
  Notebook
} from '@element-plus/icons-vue'
import {ref} from 'vue'
import {useStore} from 'vuex'
import bus from '../../bus'
const emit = defineEmits(['update:sideBarFlag'])
const props = defineProps<{sideBarFlag:string}>()
let isCollapse = ref(true)
let isRoute = ref(true)
const store = useStore()




const changePanel = (type:string)=>bus.emit("ToolPanelChange",type)

const fold = ()=>{
  bus.emit("sideBarChange",props.sideBarFlag=="fold"?"expand":"fold")
  emit("update:sideBarFlag",props.sideBarFlag=="fold"?"expand":"fold")
}


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