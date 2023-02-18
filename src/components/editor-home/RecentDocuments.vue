<template>
  <div class="recent-documents">
    <el-popover :placement="'right'" 
                :width="200" 
                v-for="(item,index) in props.fileList" 
                :key="index"
                :title="item.fileName">
      <template #reference>
        <div  class="recent-document-item" @click="openFile(item)">
          <p class="recent-document-info">
            <span class="recent-document-filename">{{item.fileName}}</span>
            <span class="recent-document-description">{{item.description}}</span>
          </p>
        </div>
      </template>
      <template #default>
        <p style="margin: 0; font-size: 14px; color: var(--el-color-info)">
          <el-divider content-position="left">Path</el-divider>
          <span class="recent-document-dirname">{{item.dirName}}</span>
          <el-divider content-position="left">Description</el-divider>
          <span class="recent-document-description">{{item.description}}</span>
        </p>
      </template>
      
    </el-popover>
    
  </div>
</template>

<script lang="ts" setup>
import {useStore} from 'vuex'
import path from 'path-browserify'

const props = defineProps<{
  fileList:{
    fileName:string,
    dirName:string,
    description:string
  }[]
}>()
const store = useStore()
const openFile = (item)=>{
  store.dispatch('openFileInNewWindow',path.join(item.dirName,item.fileName))
}

</script>

<style scoped>
.recent-document-item{
  padding: 5px;
  min-height: 65px;
  border-bottom: 2px var(--el-border-color) var(--el-border-style);
}

.recent-document-item:hover{
  cursor: pointer;
  transition-duration: 0.5s;
  text-decoration:underline;
  background-color:var(--yali-outline-item-hover-background-color) ;
  color: #3269bc;
}

.recent-document-filename{
  font-weight: bold;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.recent-document-description{
  margin: 0; 
  font-size: 14px; 
  color: var(--el-color-info);
  white-space: pre-line;
}

span{
  display: block;
}

.recent-document-info{
  margin:0;
  text-overflow:ellipsis;
  min-width: 180px;
}

.el-divider{
  margin-top: 5px;
  margin-bottom: 6px;
}
</style>