<template>

  <mark-code-mirror-it-area v-if="this.$store.state.model === 'sv'"/>
  <ya-li-editor v-else/>
</template>

<script>
import MarkCodeMirrorItArea from '@/components/MarkCodeMirrorItArea.vue'
import YaLiEditor from '@/components/yaliEditor-panel/YaliEditor.vue'
export default {
    name:"FileContentView",
    components:{
        MarkCodeMirrorItArea,
        YaLiEditor
    }
}
</script>

<style>

</style>