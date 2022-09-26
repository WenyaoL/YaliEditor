<template>
  <div id="YaliEditor" ref="ccode"></div>
</template>


<script lang="ts">
import {ref,onMounted,onUnmounted,onBeforeUnmount,watch} from 'vue'
import {useStore} from 'vuex'
import YaLiEditor from '@/YaliEditor/src'


export default {
  props: {
    content: String
  },
  setup(props,context){
    const store = useStore();
    let yali:YaLiEditor = null;
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
      store
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
  width: 90%;
}


</style>