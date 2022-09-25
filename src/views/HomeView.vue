<template>
  <div class="common-layout home">
    <dialog-tip id="dialog-tip" :displayButton="false"/>

    <el-container>
      <el-aside width="70px">
        <left-menu />
      </el-aside>
      <el-main><router-view/></el-main>
    </el-container>
  </div>

</template>

<script>
// @ is an alias to /src
import LeftMenu from '@/components/menu/LeftMenu.vue';
import DialogTip from '@/components/dialog-panel/DialogTip.vue';
import {onMounted} from 'vue'
export default {
  name: 'HomeView',
  components: {
    LeftMenu,
    DialogTip
  },
  setup(){
    onMounted(() => {
      

    })
    return {

    }
  }

}
</script>

<style>
.el-container {
  height: 100%;
}
.el-aside{
  height: 100%;
}
.common-layout.home {
  height: 100%;
}


</style>
