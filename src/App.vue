<template>
  <home-view/>
</template>

<script>
import HomeView from '@/views/HomeView.vue'
import {onMounted} from 'vue'
import { useStore } from 'vuex';

export default {
  components:{
    HomeView
  },
  setup(){
    onMounted(()=>{
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
  background-color: var(--yali-background-color);
  color: var(--yali-text-color);
}
#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  font-family:  Arial,"sourcehansans",sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  /*color: #2c3e50;*/

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
    background-color:var(--yali-scrollbar-track-background-color);
}

::-webkit-scrollbar-thumb
{
    border-radius: 5px;
    background-color: var(--yali-scrollbar-thumb-background-color);
}
</style>
