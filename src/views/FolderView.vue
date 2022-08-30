<template>
  <div class="common-layout" style="height:100%;">
    <el-container>
      <el-aside width="25%"><file-tree/></el-aside>
      <el-divider direction="vertical" style="height:100%;border-left: 2px var(--el-border-color) var(--el-border-style);" />
      <el-main><mark-it-show-area :content="this.$store.state.applicationContext.content"/></el-main>
    </el-container>
  </div>
</template>

<script>
import FileTree from '@/components/content-area/FileTree.vue'
import MarkItShowArea from "@/components/markdown-it-panel/MarkItShowArea.vue"
//import 'highlight.js/styles/vs2015.css'
export default {
    name:"FolderView",
    components:{
      FileTree,
      MarkItShowArea
    }
}
</script>

<style scoped>

.el-aside{
  position: relative;
}

.el-main{
  --el-main-padding: 10px;
}

.el-aside ::v-deep .el-tree{
  position: absolute;
}

::-webkit-scrollbar
{
    width:5px;
    height:8px;
    background-color:#F5F5F5;
}

::-webkit-scrollbar-track
{
    -webkit-box-shadow:inset 0 0 6px rgba(255,255,255,1);
    border-radius:5px;
    background-color:#F5F5F5;
}

::-webkit-scrollbar-thumb
{
    border-radius: 5px;
    background-color: rgb(204, 201, 201);
}
</style>