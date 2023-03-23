<script setup lang='ts'>
import {  ElAutocomplete } from 'element-plus'
import {ref} from 'vue/dist/vue.esm-bundler.js'
import  langCanload  from './lang.json'
import { CodemirrorManager } from './index'
const props = defineProps<{
    codemirrorManager:CodemirrorManager,
    editorId:string,
    langName:string
}>()
interface LangItem {
    value: string
}

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
        ? langCanload.filter(createFilter(queryString))
        : langCanload
    // call callback function to return suggestions
    cb(results)
}
function handleSelect(item: any) {
    props.codemirrorManager.updatedLang(item.value, props.editorId)
}

function getIconClass(item: any){
    return "icon "+item.icon + " " + item.color
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
            <div class="item">
                <i :class="getIconClass(item)"></i>
                <span :style="{paddingLeft:'5px'}">{{ item.value }}</span>
            </div>
        </template>
    </el-autocomplete>
</template>

<style scoped>

</style>