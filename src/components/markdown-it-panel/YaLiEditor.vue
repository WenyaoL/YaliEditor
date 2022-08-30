<template>
  <div id="YaliEditor" contenteditable="true">
    <mark-it-show-area :content="this.$store.state.applicationContext.content"/>
  </div>
</template>

<script>
import MarkItShowArea from "@/components/markdown-it-panel/MarkItShowArea.vue"
export default {
  components:{
    MarkItShowArea
  },
  setup(){
    
  }
    
}
</script>

<style>

</style>