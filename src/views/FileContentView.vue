<template>
  <ir-markdown v-if="this.$store.state.editModel == 'IR'"/>
  <sv-markdown v-else-if="this.$store.state.editModel == 'SV'"/>
  <only-markdown v-else/>
</template>

<script setup>
import SvMarkdown from '@/components/SvMarkdown.vue'
import OnlyMarkdown from '@/components/OnlyMarkdown.vue'
import IrMarkdown from '@/components/IrMarkdown.vue'

</script>

<style>

</style>