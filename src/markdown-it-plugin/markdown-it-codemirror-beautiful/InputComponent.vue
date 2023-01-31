<script setup lang='ts'>
import {  ElAutocomplete } from 'element-plus'
import {ref} from 'vue/dist/vue.esm-bundler.js'
import { langCanload } from './lang'
import { CodemirrorManager } from './index'
const props = defineProps<{
    codemirrorManager:CodemirrorManager,
    editorId:string,
    langName:string
}>()
interface LangItem {
    value: string
}

const lang = ref(langCanload)
const currLang = ref(props.langName)
function createFilter(queryString: string) {
    return (lang: LangItem) => {
        return (
            lang.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
    }
}
function querySearch(queryString: string, cb: any) {
    const results = queryString
        ? lang.value.filter(createFilter(queryString))
        : lang.value
    // call callback function to return suggestions
    cb(results)
}
function handleSelect(item: any) {
    props.codemirrorManager.updatedLang(item.value, props.editorId)
}

</script>

<template>

    <el-autocomplete
        :lang="currLang"
        v-model="currLang" 
        :fetch-suggestions="querySearch" 
        clearable 
        class="inline-input w-50"
        placeholder="Please Input" @select="handleSelect">
        <template #default="{ item }">
            <div class="value">{{ item.value }}</div>
        </template>
    </el-autocomplete>

</template>

<style scoped>

</style>