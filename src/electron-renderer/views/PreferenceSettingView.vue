<script setup lang='ts'>
import MiniTileBar from '../components/preference-setting/MiniTitleBar.vue'
import SideBar from '../components/preference-setting/SideBar.vue'
import KeybindingPanle from '../components/preference-setting/keybinding/KeybindingPanel.vue'
const props = defineProps<{}>()
</script>

<template>
    <div class="common-layout">
        <MiniTileBar />
        <el-container>
            <el-aside width="280px"><SideBar/></el-aside>
            <el-main><RouterView></RouterView></el-main>
        </el-container>
    </div>
</template>

<style scoped>
.common-layout{
    height: 100%;
}
.el-container{
    height: 100%;
}
</style>