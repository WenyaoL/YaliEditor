<template>
  <div class="common-layout home">
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
import LeftMenu from '@/components/menu/LeftMenu.vue'

import {onMounted} from 'vue'
export default {
  name: 'HomeView',
  components: {
    LeftMenu
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
