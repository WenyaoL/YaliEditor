<template>
  <div class="common-layout" style="height:100%;">
    <el-container>
          <el-aside width="50%">
            <code-mirror-area/>
          </el-aside>
      <!--<el-divider direction="vertical" style="height:100%;border-left: 2px var(--el-border-color) var(--el-border-style);" />-->
      <el-main><mark-it-show-area :content="this.$store.state.applicationContext.content"/></el-main>
    </el-container>
  </div>
</template>

<script>
import MarkItShowArea from "@/components/markdown-it-panel/MarkItShowArea.vue"
import CodeMirrorArea from "@/components/content-area/CodeMirrorArea.vue"

export default {
    name: "MarkCodeMirrorItArea",
    components:{
        MarkItShowArea,
        CodeMirrorArea
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

::v-deep ::-webkit-scrollbar
{
    width:5px;
    height:8px;
    background-color:#F5F5F5;
}

::v-deep ::-webkit-scrollbar-track
{
    -webkit-box-shadow:inset 0 0 6px rgba(255,255,255,1);
    border-radius:5px;
    background-color:#F5F5F5;
}

::v-deep ::-webkit-scrollbar-thumb
{
    border-radius: 5px;
    background-color: rgb(204, 201, 201);
}

</style>