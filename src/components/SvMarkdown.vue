<template>
  <div class="common-layout" style="height:100%;">
    <el-container>
          <el-aside width="50%">
            <code-mirror-show/>
          </el-aside>
      <!--<el-divider direction="vertical" style="height:100%;border-left: 2px var(--el-border-color) var(--el-border-style);" />-->
      <el-main>
        <div class="write">
        <markdown-it-show :content="this.$store.state.applicationContext.content"/>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import MarkdownItShow from "@/components/markdown-it-panel/MarkdownItShow.vue"
import CodeMirrorShow from "@/components/codemirror-panel/CodeMirrorShow.vue"

export default {
    components:{
        MarkdownItShow,
        CodeMirrorShow,
    }
}
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