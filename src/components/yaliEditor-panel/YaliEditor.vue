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
      yali = new YaLiEditor("YaliEditor",{
        isTestModel:true
      })
      yali.render(store.state.applicationContext.content)
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
}


</style>