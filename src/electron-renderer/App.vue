<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { onMounted } from 'vue'
import bus from './bus'

export default {
  setup() {
    window.electronAPI.INVOKE.getCurrTheme().then((theme) => {
      if (global.yaliEditor.type != "preference" && theme == "dark") {
        document.documentElement.classList.add("dark")
      }
      bus.emit('Home-show')
    })
    onMounted(() => {
      //window.electronAPI.loadFonts()

    })


    bus.on('window-close',()=>{
      window.electronAPI.SEND.closeWindow()
    })

  }
}
</script>

<style>
html {
  height: 100%;
}

body {
  height: 100%;
  margin: 0;
}

#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  font-family: Arial, "sourcehansans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  /*color: #2c3e50;*/

  height: 100%;
  line-height: 1.42857143;
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 1);
  border-radius: 5px;
  background-color: var(--yali-scrollbar-track-background-color);
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: var(--yali-scrollbar-thumb-background-color);
}
</style>
