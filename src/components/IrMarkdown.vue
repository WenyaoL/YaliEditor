<template>
  <div class="write">
    <YaliEditor :disableEdit="props.disableEdit"/>
  </div>
</template>

<script setup>
import YaliEditor from '@/components/yaliEditor-panel/YaliEditor.vue'
const props = defineProps({
  disableEdit: Boolean
})
</script>

<style>
.write{
    font-family:  Arial,"sourcehansans",sans-serif;
    min-height: 90%;
    max-width: 888px;
    margin: auto;
    position: relative;
}
</style>