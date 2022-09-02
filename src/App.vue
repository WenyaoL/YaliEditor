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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
