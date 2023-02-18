<template>
  <div class="recentDocument">
    <recent-documents v-if="getFileListLength>0" :fileList="getFileList"/>
    <el-empty v-else description="暂无数据"></el-empty>
  </div>
</template>

<script lang="ts" setup>
import RecentDocuments from '@/components/editor-home/RecentDocuments.vue';
import {computed,onMounted} from 'vue'
import {useStore} from 'vuex';
const store = useStore()
const getFileList = computed(()=>store.state.editorModule.applicationContext.recentDocuments)
const getFileListLength = computed(()=>{
    let recentDocuments = store.state.editorModule.applicationContext.recentDocuments
    return recentDocuments.length
})

onMounted(() => {
  //获取最近打开文件信息
  store.dispatch('getRecentDocuments').then(data=>{
    store.commit('updateRecentDocuments',data)
  })
})

</script>

<style scoped>
.recentDocument{
  padding: 5px;
}
.recentDocument-tip{
    text-align: center;
    font-weight: 900;;
}
.el-divider.el-divider--horizontal{
    margin: 0;
    border-top: 1px var(--el-border-color) var(--el-border-style);
}
</style>