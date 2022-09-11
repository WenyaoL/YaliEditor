<template>
  <ir-markdown v-if="editModel == 'IR'"/>
  <sv-markdown v-else-if="editModel == 'SV'"/>
  <only-markdown v-else/>
</template>

<script setup>
import SvMarkdown from '@/components/SvMarkdown.vue'
import OnlyMarkdown from '@/components/OnlyMarkdown.vue'
import IrMarkdown from '@/components/IrMarkdown.vue'
import {useStore} from 'vuex'
import {ref} from 'vue'
const store = useStore()

const editModel = ref(store.state.editModel)


</script>

<style>

</style>