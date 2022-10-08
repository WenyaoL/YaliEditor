<template>
    <div class="outline">
        <file-context-outline :outline="store.state.applicationContext.outline"/>
    </div>
</template>

<script lang="ts" setup>
import FileContextOutline from '@/components/menu/FileContextOutline.vue'
import {useStore} from 'vuex'
const store = useStore()
</script>

<style>

</style>