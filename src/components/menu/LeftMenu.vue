<template>
  <el-menu
    default-active="1"
    class="el-menu-vertical-demo"
    background-color="rgb(250, 250, 250)"
    :collapse="isCollapse"
    :router="isRoute"
  > 
    <el-menu-item index="1" route="/">
      <el-icon><document /></el-icon>
      <template #title>文件</template>
    </el-menu-item>
    <el-menu-item index="2" route="/folder">
      <el-icon><folder /></el-icon>
      <template #title>文件夹</template>
    </el-menu-item>
    <el-menu-item index="3" route="/test">
      <el-icon><QuestionFilled /></el-icon>
      <template #title>关于</template>
    </el-menu-item>

    <el-menu-item index="4"  route="/designDashboard">
      <el-icon><setting /></el-icon>
      <template #title>设置</template>
    </el-menu-item>
  </el-menu>
</template>

<script>
import {
  Document,
  Menu as IconMenu,
  Folder,
  Setting,
  QuestionFilled
} from '@element-plus/icons-vue'

export default {
    name:'LeftMenu',
    components:{
      Document,
      IconMenu,
      Folder,
      Setting,
      QuestionFilled
    },
    data(){
        return {
            isCollapse:true,
            isRoute:true,
        }
    }
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