<template>

  <el-tree :data="applicationContext.tree" :props="props" @node-click="nodeClick">
    <template #default="{ node,data}">
      <el-icon v-if="isFile(data)"><document /></el-icon>
      <el-icon v-else><folder /></el-icon>
      <span>{{ node.label }}</span>
    </template>
  </el-tree>

  
</template>

<script>
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
        const applicationContext = store.state.applicationContext
        function isFile(node){
            if(node.child == undefined) return true
            return false
        }

        function readFile(data){
            window.electronAPI.readFile({
                    path:data.path,  //指定读取路径（当路径缺失时，使用上下文中的路径）
                    applicationContext:JSON.stringify(applicationContext)   //上下文
                }).then(res=>{
                    store.commit('updateApplicationContext',{
                        isSave:true,
                        filePath:data.path,
                        content:res,
                        title:data.name
                    })
            })
        }

        function nodeClick(data,node,event){
            if(!isFile(data)) return 
            //IR模式需要提前转换文本
            if(store.state.editModel == "IR"){
                store.commit('updateContent',store.state.yaliEditor.getMarkdownText())
            }
            if(applicationContext.isSave){
                readFile(data)
                document.getElementsByTagName("title")[0].innerText = data.name
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
                        window.electronAPI.invokeSave({applicationContext:JSON.stringify(applicationContext)})
                        ElMessage({
                            message: '成功保存!',
                            type: 'success',
                        })
                        //读取文件
                        readFile(data)
                        document.getElementsByTagName("title")[0].innerText = data.name
                    }).catch((action) => {
                        if(action === 'cancel'){
                            ElMessage({
                                message: '更改已丢弃!',
                                type: 'warning',
                            })
                            //读取文件,强制覆盖
                            readFile(data)
                            document.getElementsByTagName("title")[0].innerText = data.name
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