<template>
  <div class="recentDocument">
    <recent-documents v-if="getFileListLength>0" :fileList="getFileList"/>
    <el-empty v-else description="暂无数据"></el-empty>
  </div>
</template>

<script lang="ts" setup>
import RecentDocuments from '@/components/menu/RecentDocuments.vue';
import {computed} from 'vue'
import {useStore} from 'vuex';
const store = useStore()
const getFileList = computed(()=>store.state.applicationContext.recentDocuments)
const getFileListLength = computed(()=>{
    let recentDocuments = store.state.applicationContext.recentDocuments
    return recentDocuments.length
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