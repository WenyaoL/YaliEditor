<template>
  
  <div id="YaliEditor" ref="ccode" @contextmenu.prevent="onContextmenu"></div>
</template>


<script lang="ts">
import {ref,onMounted,onUnmounted,onBeforeUnmount,watch} from 'vue'
import {useStore} from 'vuex'
import YaLiEditor from '@/YaliEditor/src'
import Constants from '@/YaliEditor/src/constants'
import ContextMenu from '@imengyu/vue3-context-menu'
import {createCommonItems} from './tipitemsCommon'
import {exec} from './utils'

import {getCurrentInstance} from 'vue';
export default {
  props: {
    content: String
  },
  setup(props,context){
    const store = useStore();

    let yali:YaLiEditor = null;

    const instance = getCurrentInstance()
  

    function onContextmenu(e: MouseEvent){
      console.log(e);
      console.log(e.target)
      let editor:YaLiEditor = store.state.yaliEditor;
      
      exec(editor,e)
      
      //prevent the browser's default menu

      e.preventDefault();
      //shou your menu
      
      
      

    }
    onMounted(()=>{
      yali = new YaLiEditor("YaliEditor")
      yali.render(store.state.applicationContext.content)
      yali.ir.undoAddListener = (editor:YaLiEditor)=>{
        store.commit('updateFileState',false)
      }
      store.commit('setYaliEditor',yali)
      
    })
    watch(()=>store.state.applicationContext.content,(newValue)=>{
      yali.render(newValue)
    })

    onBeforeUnmount(() => {      
      store.commit('updateContent',yali.getMarkdownText()) 
    })
    return{
      store,
      onContextmenu,
      instance
    }
  }
}
</script>

<style>

#YaliEditor{
  text-align: left;
  outline: none;
  position: absolute;
  height: 100%;
  width: 100%;
}


</style>