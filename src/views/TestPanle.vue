<template>
<div >
    <markdown-it-show :content="help"/>
</div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue'
import {useStore} from 'vuex'
import MarkdownItShow from '@/components/markdown-it-panel/MarkdownItShow.vue'

const store = useStore();
const help = ref("")
window.electronAPI.openHelpDocumentation().then(data=>{
    help.value = data
})


</script>

<style scope="this api replaced by slot-scope in 2.5.0+">

</style>