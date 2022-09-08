<template>
  <div class="write">
    <div id="YaliEditor" ref="ccode"></div>
  </div>
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

<style lang="scss" scoped>
#YaliEditor{
  text-align: left;
  outline: none;
}

.write{
    font-family:  Arial,"sourcehansans",sans-serif;
    max-width: 860px;
    margin: 0 auto;
    padding: 30px;
    padding-bottom: 100px;
}

h1,h2,h3,h4,h5,h6,p{
  font-family:  Arial,"sourcehansans",sans-serif;
}
</style>