<template>
  <div class="common-layout" style="height:100%;">
    <el-container>
          <el-aside width="50%">
            <code-mirror-show/>
          </el-aside>
      <!--<el-divider direction="vertical" style="height:100%;border-left: 2px var(--el-border-color) var(--el-border-style);" />-->
      <el-main>
        <div class="write">
        <markdown-it-show :content="store.state.editorModule.applicationContext.content"/>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import MarkdownItShow from "./editor-home/MarkdownItShow.vue"
import CodeMirrorShow from "./editor-home/CodeMirrorShow.vue"
import {useStore} from 'vuex'
const store = useStore()
</script>

<style scoped>
::v-deep .el-main{
    --el-main-padding: 0px;
    margin-left: 10px;
}

::v-deep .el-container{
  height: 100%;
}



</style>