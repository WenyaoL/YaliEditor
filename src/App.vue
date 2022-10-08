<template>
  <home-view/>
</template>

<script>
import HomeView from '@/views/HomeView.vue'
import {loadAll} from '@/electron-renderer/ipmRendererLoad'
import {onMounted} from 'vue'
import { useStore } from 'vuex';

export default {
  components:{
    HomeView
  },
  setup(){
    onMounted(()=>{
      const store = useStore()
      loadAll(store)
      window.electronAPI.loadFonts()

      /*window.electronAPI.loadRenderApplicationContext().then(payload=>{
        console.log("加载到的初始上下文",payload);
        store.commit('initApplication',payload.applicationContext)
      })*/
    })
  }
}
</script>

<style>
html{
  height: 98%;
}
body{
  height: 100%;
}
#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  font-family:  Arial,"sourcehansans",sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  height: 100%;
  line-height: 1.42857143;
}

::-webkit-scrollbar
{
    width:5px;
    height: 5px;
    background-color:#F5F5F5;
}

::-webkit-scrollbar-track
{
    -webkit-box-shadow:inset 0 0 6px rgba(255,255,255,1);
    border-radius:5px;
    background-color:#F5F5F5;
}

::-webkit-scrollbar-thumb
{
    border-radius: 5px;
    background-color: rgb(204, 201, 201);
}
</style>
