<template>
    <div class="outline">
        <file-context-outline v-if="getOutlineLength>0"  :outline="getOutline"/>
        <el-empty v-else description="暂无数据"></el-empty>
    </div>
</template>

<script lang="ts" setup>
import FileContextOutline from '@/components/menu/FileContextOutline.vue'
import {useStore} from 'vuex'
import {computed} from 'vue'

const getOutline = computed(()=>store.state.applicationContext.outline)
const getOutlineLength = computed(()=>store.state.applicationContext.outline.length)
const store = useStore()

</script>

<style scoped>
.outline{
    padding: 5px;
}
.outline-tip{
    text-align: center;
    font-weight: 900;;
}
.el-divider.el-divider--horizontal{
    margin: 0;
    border-top: 1px var(--el-border-color) var(--el-border-style);
}
</style>