<script setup lang='ts'>
import { ref, watch} from 'vue'
import { Delete} from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import i18n  from '../../vue-i18n'
import bus from '../../bus'
const props = defineProps<{}>()
const store = useStore()
const deleteCache = (event) => {
    store.dispatch('clearDataCache')
}

const currLocale = ref<string>(global.yaliEditor.locale)
const localeOptions = ref(['zh','en'])

watch(currLocale,(val,oldVal)=>{
    if(val == 'en') {
        global.yaliEditor.locale = val
        store.dispatch('updateI18nLocale','en')
        store.dispatch('updateLocale','en')
    }else if(val == 'zh'){
        global.yaliEditor.locale = val
        store.dispatch('updateI18nLocale','zh')
        store.dispatch('updateLocale','zh')
    }
    
})

</script>

<template>
    <div>
        <h3 class="system-heading">{{ $t('SystemPanel.system_heading') }}</h3>
        <h4 class="system-heading">{{ $t('SystemPanel.system_heading_clear') }}</h4>
        <p class="describe-info">{{ $t('SystemPanel.system_clear_info') }}</p>
        <div>
            <el-button :icon="Delete" type="warning" @click="deleteCache($event)">{{ $t('SystemPanel.system_clear_button') }}</el-button>
            <span class="describe-info">{{ $t('SystemPanel.system_clear_button_info') }}</span>
        </div>

        <h4 class="system-heading">{{ $t('SystemPanel.system_heading_i18n') }}</h4>
        <p class="describe-info">{{ $t('SystemPanel.system_i18n_info') }}</p>
        <div>
            <el-select v-model="currLocale" class="m-2" placeholder="Select">
                <el-option v-for="item in localeOptions" :key="item" :value="item" />
            </el-select>
        </div>
    </div>
</template>

<style scoped>
.system-heading {
    color: gray;
}

.describe-info {
    font-size: 10px;
}
</style>