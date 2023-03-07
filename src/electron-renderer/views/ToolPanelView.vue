<script setup lang='ts'>
import bus from '../bus'

import FileTree from '../components/editor-home/FileTree.vue'
import ContextOutlineView from './ContextOutlineView.vue'
import RecentDocumentsView from './RecentDocumentsView.vue'
import { ref,onMounted } from 'vue'

const currTool = ref('ContextOutline')

onMounted(()=>{
    bus.on("ToolPanelChange",(type:'ContextOutline' | 'RecentDocuments' | 'FileTree')=>{
        currTool.value = type
    })
})


</script>

<template>
    <div class="tool-panel" >
        <ContextOutlineView v-show="currTool=='ContextOutline'"></ContextOutlineView>
        <RecentDocumentsView v-show="currTool == 'RecentDocuments'"></RecentDocumentsView>
        <FileTree v-show="currTool == 'FileTree'"></FileTree>
    </div>
</template>

<style scoped>

</style>