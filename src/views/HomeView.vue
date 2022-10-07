<template>
  <div class="common-layout home">
    <dialog-tip id="dialog-tip" :displayButton="false"/>
    <el-container>
      <el-aside :width="sideBarWidth">
            <el-container>
              <el-aside width="70px">
                <left-menu />
              </el-aside>
              <!--这里应该渲染工具-->
              <el-main class="tool-bar">
                <router-view/>
              </el-main>
          </el-container>
      </el-aside>
      <el-divider :direction="'vertical'" style="height: 100%;"/>

      <el-main>    
        <!---->
        <file-content-view/>
      </el-main>
    </el-container>



  </div>

</template>

<script lang="ts" setup>
// @ is an alias to /src
import LeftMenu from '@/components/menu/LeftMenu.vue';
import DialogTip from '@/components/dialog-panel/DialogTip.vue';
import FileContentView from './FileContentView.vue'
import {onMounted,ref,watch} from 'vue'
import {useStore} from 'vuex'
const store = useStore()
let sideBarWidth = ref("70px")
watch(()=>store.state.sideBarFold,(newValue)=>{
  if(newValue){
    sideBarWidth.value = "70px"
  }else{
    sideBarWidth.value = "320px"
  }
})
  onMounted(() => {
    

  })

</script>

<style scoped>
.el-container {
  height: 100%;
}
.el-aside{
  height: 100%;
}
.common-layout.home {
  height: 100%;
}

.common-layout.home :deep(.el-main.tool-bar){
  padding:0px;
}

</style>
