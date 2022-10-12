<template>
  <div class="file-outline">
    <p>
    <span v-for="(item,index) in props.outline" :key="index" :class="getHeadingStyle(item.level)">
        <a :to-href="item.id">{{item.content}}</a>
    </span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
const props = defineProps<{
  outline:{
    type: string;
    content: string | null;
    id: string;
    level: number;
  }[]
}>()

const getHeadingStyle = (level:any)=>{
    if(level == 1){
        return "outline-item-1"
    }else if(level == 2){
        return "outline-item-2"
    }else if(level == 3){
        return "outline-item-3"
    }else if(level == 4){
        return "outline-item-4"
    }else if(level == 5){
        return "outline-item-5"
    }
}

</script>



<style>
.file-outline span{
    display: block;
    cursor: pointer;
    white-space: pre-wrap;
    word-break: break-all;
    margin-bottom: 3px;
    margin-top: 3px;
}

.outline-item-1:hover,
.outline-item-2:hover,
.outline-item-3:hover,
.outline-item-4:hover,
.outline-item-5:hover{
    transition-duration: 0.5s;
    text-decoration:underline;
    background-color:var(--yali-outline-item-hover-background-color) ;
    color: #3269bc;
}

.outline-item-1{
    font-weight: 700;
}
.outline-item-2{
    padding-left: 10px;
    font-weight: 600;
}
.outline-item-3{
    padding-left: 17.5px;
}
.outline-item-4{
    padding-left: 25px;
}
.outline-item-5{
    padding-left: 32.5px;
}
</style>