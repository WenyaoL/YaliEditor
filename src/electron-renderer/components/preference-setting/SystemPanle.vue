<script setup lang='ts'>
import {ref} from 'vue'
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
import {useStore} from 'vuex'
import bus from '../../bus'
const props = defineProps<{}>()
const store = useStore()
const deleteCache = (event)=>{
    store.dispatch('clearDataCache')
}

</script>

<template>
    <div>
        <h3 class="system-heading">系统</h3>
        <h4 class="system-heading">清除</h4>
        <p class="describe-info">这里提供缓存清除等功能,如:最近文件数据清除,App数据缓存清除</p>
        <div>
            <el-button :icon="Delete" type="warning" @click="deleteCache($event)" >清除缓存数据</el-button>
            <span class="describe-info">(这会导致Yali重置到安装时的默认状态)</span>
        </div>
        
    </div>
</template>

<style scoped>
.system-heading {
    color: gray;
}
.describe-info{
    font-size: 10px;
}
</style>