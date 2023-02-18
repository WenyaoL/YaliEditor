<script setup>
import { ref } from 'vue';
import {useRouter} from 'vue-router'

const router = useRouter()

const list = [
    {
        name:"快捷键",
        icon:`<svg t="1676390385805" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7881"><path d="M541.167 356.444V239.778h-58.333v116.667H162v427.778h700V356.444H541.167z m262.5 369.445H220.333V414.778h583.333v311.111z" p-id="7882"></path><path d="M249.5 443.944h175v58.333h-175zM453.667 443.944H512v58.333h-58.333zM541.167 443.944H599.5v58.333h-58.333zM628.667 443.944H687v58.333h-58.333zM716.167 443.944H774.5v58.333h-58.333zM249.5 541.167h58.333V599.5H249.5zM337 541.167h58.333V599.5H337zM424.5 541.167h58.333V599.5H424.5zM512 541.167h58.333V599.5H512zM249.5 638.389h281.944v58.333H249.5zM638.389 696.722H774.5V560.611h-58.333v77.778h-77.778z"  p-id="7883"></path></svg>`,
        path:'/preference/keybinding'
    },
    {
        name:"系统",
        icon:`<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa=""><path fill="currentColor" d="M764.416 254.72a351.68 351.68 0 0 1 86.336 149.184H960v192.064H850.752a351.68 351.68 0 0 1-86.336 149.312l54.72 94.72-166.272 96-54.592-94.72a352.64 352.64 0 0 1-172.48 0L371.136 936l-166.272-96 54.72-94.72a351.68 351.68 0 0 1-86.336-149.312H64v-192h109.248a351.68 351.68 0 0 1 86.336-149.312L204.8 160l166.208-96h.192l54.656 94.592a352.64 352.64 0 0 1 172.48 0L652.8 64h.128L819.2 160l-54.72 94.72zM704 499.968a192 192 0 1 0-384 0 192 192 0 0 0 384 0z"></path></svg>`,
        path:'/preference/system'
    }
]
const currActiveItem = ref('快捷键')
function settingItemClick(item){
    currActiveItem.value = item.name
    router.push(item.path)
    
}
</script>

<template>
    <div class="setting-side-bar">
        <h3 class="setting-heading">Preference setting</h3>
        <div class="setting-list">
            <div 
            class="setting-item" 
            v-for="item in list" 
            :class="{active:item.name == currActiveItem}"
            @click="settingItemClick(item)"
            >
                <span class="setting-icon" v-html="item.icon"></span>
                <span class="setting-name">{{ item.name }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.setting-side-bar {
    height: 100%;
    background-color: rgb(243, 243, 243);
}

.setting-heading {
    color: gray;
    margin: 0;
    padding: 15px 0px;
    text-align: center;
}
.setting-list{
    user-select: none;
}

.setting-item{
    overflow: hidden;
    border: solid;
    border-radius: 2px;
    border-width: 0;
    border-left-width: 4px;
    border-color: transparent;
}
.setting-item:hover{
    background-color: rgb(215, 215, 215);
}

.setting-item.active{
    border-color: #409EFF;
}
.setting-icon{
    float: left;
    display: inline-block;
    height: 42px;
    width: 42px;
    margin: 8px 16px;
    fill:gray;
    color: gray;
}
.setting-name{
    color: black;
    float: right;
    display: inline-block;
    height: 58px;
    width: 188px;
    line-height: 58px;
}
</style>