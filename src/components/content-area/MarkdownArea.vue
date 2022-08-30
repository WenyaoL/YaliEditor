<template>
  <div class="markdown">
    <el-input
        v-model="content"
        type="textarea"
        placeholder="Please input"
    />
  </div>
</template>

<script>
export default {
    name:"MarkdownArea",
    data(){
        return{
            content:' '
        }
    }
}
</script>

<style>

.markdown{
    height: 100%;
}
div .el-textarea{
    height: 100%;
    --el-input-hover-border-color:none;
    --el-input-focus-border-color:none;
}

.el-textarea .el-textarea__inner{
    height: 100%;
    box-shadow: none;
    border: 1px;
    font-size: 18px;
    
}

</style>