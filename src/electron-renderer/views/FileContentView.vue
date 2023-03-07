<template>
  <ir-markdown v-if="store.state.editorModule.editModel == 'IR'" :disableEdit="false"/>
  <sv-markdown v-else-if="store.state.editorModule.editModel == 'SV'"/>
  <only-markdown v-else/>
</template>

<script setup>
import SvMarkdown from '../components/SvMarkdown.vue'
import OnlyMarkdown from '../components/OnlyMarkdown.vue'
import IrMarkdown from '../components/IrMarkdown.vue'
import {useStore} from 'vuex'
const store = useStore()

</script>

<style>

</style>