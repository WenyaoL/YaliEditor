<template>
  
  <div id="YaliEditor" ref="ccode" @contextmenu.prevent="onContextmenu"></div>
</template>


<script lang="ts">
import {ref,onMounted,onUnmounted,onBeforeUnmount,watch} from 'vue'
import {useStore} from 'vuex'
import YaLiEditor from '@/YaliEditor/src'
import Constants from '@/YaliEditor/src/constant/constants'
import ContextMenu from '@imengyu/vue3-context-menu'
import {createCommonItems} from './tipitemsCommon'
import {exec} from './utils'

import {getCurrentInstance} from 'vue';
import { EditorConfig } from '@/YaliEditor/src/options'
export default {
  props: {
    content: String,
    disableEdit:Boolean,
  },
  setup(props,context){
    const store = useStore();

    let yali:YaLiEditor = null;

    const instance = getCurrentInstance()
  

    function onContextmenu(e: MouseEvent){
      let editor:YaLiEditor = store.state.yaliEditor;
      
      exec(editor,e)

      e.preventDefault();
    }
    onMounted(()=>{
      const config = EditorConfig.defalut()
      .ir
      .setDisableEdit(props.disableEdit)
      .setTheme(store.state.applicationContext.theme)
      .end()
      
      yali = new YaLiEditor("YaliEditor",config)
      //注册监听事件
      yali.ir.applicationEventPublisher.subscribe("refreshedToc",(headings:any)=>{
        store.commit("updateOutline",headings)
      })
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