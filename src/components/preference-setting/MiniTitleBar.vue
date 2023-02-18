<script setup>
import {Close} from '@element-plus/icons-vue'
import bus from '@/bus'
import {useStore} from 'vuex'
const store = useStore()
function windowClose(){
    bus.emit('preference::saveSetting')
    bus.emit('window-close')
}

</script>

<template>
    <div class="title-bar">
        <div class="window-close" @click="windowClose">
            <span>
                <el-icon :size="20"><Close /></el-icon>
            </span>
        </div>
    </div>
</template>

<style scoped>
.title-bar{
    -webkit-app-region: drag;
    user-select: none;
    background: transparent;
    transition: color .5s ease-in-out;
    position:fixed;
    left: 0;
    top: 0;
    right: 0;
    height: 30px;
    cursor: pointer;
    z-index: 100;
}
.window-close{
    float: right;
    height: 25px;
    width: 40px;
    line-height: 25px;
    -webkit-app-region: no-drag;
}
.window-close:hover{
    background-color: rgb(228, 79, 79);
}

.window-close>span{
    display:block;
    height: 25px;
    width: 20px;
    margin: 2px auto;
}
</style>