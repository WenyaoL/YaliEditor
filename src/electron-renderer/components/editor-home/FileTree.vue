<template>

  <el-tree :data="applicationContext.tree" :props="props" @node-click="nodeClick">
    <template #default="{ node,data}">
      <el-icon v-if="isFile(data)"><document /></el-icon>
      <el-icon v-else><folder /></el-icon>
      <span>{{ node.label }}</span>
    </template>
  </el-tree>

  
</template>

<script lang="ts">
import {ref,reactive,onMounted} from 'vue'
import {Document,Folder,} from '@element-plus/icons-vue'
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
    components:{
      Document,
      Folder,
    },
    setup(){
        const props = reactive({value: 'path',label: 'name',children: 'child',})
        const store = useStore();
        const applicationContext = store.state.editorModule.applicationContext
        function isFile(node){
            if(node.child == undefined) return true
            return false
        }

        function readFile(data){
            store.dispatch('readFile',data.path).then(res=>{
                    store.commit('updateApplicationContext',{
                        isSave:true,
                        filePath:data.path,
                        content:res,
                        title:data.name
                    })
                    store.dispatch('addRecentDocument',{
                        filePath:data.path,
                        description:res.substring(0,30)
                    })
            })
        }

        function nodeClick(data,node,event){
            if(!isFile(data)) return 
            //IR模式需要提前转换文本
            if(store.state.editorModule.editModel == "IR"){
                store.commit('updateContent',store.state.editorModule.yaliEditor.getMarkdownText())
            }
            if(applicationContext.isSave){
                readFile(data)
                document.title = data.name
            }else{
                //打开信息盒
                ElMessageBox.confirm(
                    '是否保存更,不保存将丢弃更改',
                    '保存',
                    {
                        distinguishCancelAndClose: true,
                        confirmButtonText: '保存',
                        cancelButtonText: '丢弃',
                    }
                    ).then(() => {
                        //保存文件
                        store.dispatch('saveFile')
                        
                        ElMessage({
                            message: '成功保存!',
                            type: 'success',
                        })
                        //读取文件
                        readFile(data)
                        document.title = data.name
                    }).catch((action) => {
                        if(action === 'cancel'){
                            ElMessage({
                                message: '更改已丢弃!',
                                type: 'warning',
                            })
                            //读取文件,强制覆盖
                            readFile(data)
                            document.title = data.name
                        }else{
                            
                        }
                    })
            }
        }

        return {
            props,
            isFile,
            nodeClick,
            applicationContext
        }
    }
}




</script>

<style scoped>
.el-tree{
    min-width: 100%;
    display: grid;
}

::v-deep ::-webkit-scrollbar
{
    width:5px;
    height:8px;
    background-color:#F5F5F5;
}

::v-deep ::-webkit-scrollbar-track
{
    -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
    border-radius:5px;
    background-color:#F5F5F5;
}

::v-deep ::-webkit-scrollbar-thumb
{
    border-radius: 5px;
    background-color: #868383;
}

</style>