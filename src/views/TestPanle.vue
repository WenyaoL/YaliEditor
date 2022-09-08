<template>
<div >
    <el-button type="primary" @click="savePDF()">保存pdf</el-button>
    <ir-markdown ref="markdown"/>
    
</div>

</template>

<script setup lang="ts">
import html2canvas from 'html2canvas'
import {jsPDF} from 'jspdf'
import {ref,onMounted} from 'vue'
import {useStore} from 'vuex'
//import SvMarkdown from '@/components/SvMarkdown.vue'
//import OnlyMarkdown from '@/components/OnlyMarkdown.vue'
import IrMarkdown from '@/components/IrMarkdown.vue'

const markdown = ref(null)
const doc = new jsPDF({
    unit:'px',
    orientation: 'p', 
    format: 'a4' 
})
const store = useStore();
function savePDF(){
    
    console.log(markdown.value.$el);
    console.log("测试121");
    /*doc.text('尼玛', 10, 10)
    doc.save("123.pdf")*/
    doc.addFileToVFS('sourcehansans-normal.ttf',store.state.fonts.normal)
    
    doc.addFont('sourcehansans-normal.ttf','sourcehansans','normal')
    doc.setFont('sourcehansans', 'normal');
    console.log(doc.getFontList());
    console.log(store.state.fonts.normal.length);
    doc.setFontSize(15);
    let root = markdown.value.$el as HTMLElement
    
    root.insertAdjacentHTML('afterbegin','<style>*{font-family:  Arial,sans-serif, serif,"sourcehansans";}</style>')
    let el = root.cloneNode(true) as HTMLElement
    
    //el.style.fontFamily = 'Arial, serif,"sourcehansans"'
    
    let mathDom = el.getElementsByClassName("markdown-it-mathjax-beautiful")
    for (let index = 0; index < mathDom.length; index++) {
        const element = mathDom[index];
        element.remove()
    }

    let gutters = el.getElementsByClassName("cm-gutterElement")
    for (let index = 0; index < gutters.length; index++) {
        const element = gutters[index] as HTMLElement;
        element.style.fontFamily = "sourcehansans"
        if(element.style.height === "14px"){
            element.style.height = "22.4px"
        }
         
    }
    
    console.log(el);

    
    doc.html(el.innerHTML, {
        jsPDF:doc,
        margin:[10,1000,10,30],
        width:400,
        windowWidth:1200
    }).save('chinese-html.pdf').then(o=>{
        console.log("测试");
        //回复原来字体
        root.removeChild(root.firstChild)
    });
}

onMounted(()=>{
    console.log(markdown.value);
})

</script>

<style scope="this api replaced by slot-scope in 2.5.0+">
/*
*{
    font-family:  Arial,sans-serif, serif,'sourcehansans';
}
*/
</style>