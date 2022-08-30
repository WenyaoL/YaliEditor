<template>
  <div id="YaliEditor" ref="ccode">
    
  </div>
</template>


<script lang="ts">
import {ref,onMounted} from 'vue'
import {useStore} from 'vuex'
import YaLiEditor from '@/YaliEditor/src'
import 'highlight.js/styles/vs2015.css'


export default {
  setup(){
    const ccode = ref(null);
    const store = useStore();
    let yali:YaLiEditor = null;
    onMounted(()=>{
      yali = new YaLiEditor("YaliEditor",{
        isTestModel:true
      })
      yali.render(store.state.applicationContext.content)
    })
    return{
      ccode,
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

::v-deep pre.hljs {
  padding: 4px 2px;
  display: flex;
  position: relative;
  overflow: auto;
  font-size: 13.5px;
  //max-height: 210px;
  code{
    margin-left: 8px;
  }
  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
    border-right-style: solid;
    border-width: 1.5px;
    text-align: center;
    font-weight: bold;
    li {
      //list-style: decimal-leading-zero;
      position: relative;
      padding-left: 10px;
    }
  }
  b.name {
    top: 2px;
    position: absolute;
    z-index: 10;
    color: #999;
    pointer-events: none;
  }
}



</style>