<template>
  <div class="recent-documents">
    <el-popover :placement="'right'" 
                :width="200" 
                v-for="(item,index) in props.fileList" 
                :key="index"
                :title="item.fileName">
      <template #reference>
        <div  class="recent-document-item">
          <p>
            <span class="recent-document-filename">{{item.fileName}}</span>
            <span class="recent-document-description">{{item.description}}</span>
          </p>
          <el-divider />
        </div>
      </template>
      <template #default>
        <p style="margin: 0; font-size: 14px; color: var(--el-color-info)">
          <span class="recent-document-dirname">{{item.dirName}}</span>
          <span class="recent-document-description">{{item.description}}</span>
        </p>
      </template>
      
    </el-popover>
    
  </div>
</template>

<script lang="ts" setup>
import {ElPopper} from 'element-plus'

const props = defineProps<{
  fileList:{
    fileName:string,
    dirName:string,
    description:string
  }[]
}>()



</script>

<style scoped>
.recent-document-item{
  padding: 5px;
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
  margin: 0; font-size: 14px; color: var(--el-color-info)
}

span{
  display: block;
}

p{
  margin:0;
  text-overflow:ellipsis;
  min-width: 236px;
}

.el-divider{
  margin-top: 5px;
  margin-bottom: 0px;
  border-top: 2px var(--el-border-color) var(--el-border-style);
}
</style>