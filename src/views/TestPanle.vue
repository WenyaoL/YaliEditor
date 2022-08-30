<template>
    <div id="vditor" ref="test">

    </div>
</template>

<script lang="ts">
import "vditor/dist/index.css"
import {ref,onMounted} from 'vue'
import Vditor from 'vditor'
export default {
    components:{    
    },
    setup(){
        const test = ref(null)
        let editor = null

        onMounted(()=>{
            

            editor = new Vditor('vditor', { //4.刚刚声明的变量contentEditor被赋值为一个Vditor实例,
              height: 500,                               
              placeholder: '此处为话题内容……',             
              theme: 'classic',
              after(){
              },
              toolbarConfig: {
                hide:true,
              },
              mode: 'ir',
              toolbar: [],
            })
            //editor.disabled()
        })
        
        
        return{
            test
        }

    }
}
</script>

<style lang="less">
//@import  "@/assets/_content";
//@import  "@/assets/_ir";
/*@import "@/assets/_hint";
@import "@/assets/index";
@import "@/assets/_panel";
@import "@/assets/_reset";*/

</style>>
