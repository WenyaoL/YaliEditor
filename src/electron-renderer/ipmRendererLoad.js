
import {updateLine,updateBlock,updateMulLine,createToc} from '@/codemirror-plugin/codeCommon'
import {updateLineIR,updateBlockIR,updateMulLineIR, createTocIR} from '@/YaliEditor/src/util/hotkeyProcess' 
import html2canvas from 'html2canvas'
import Canvas2Image from './canvas2image'
import {jsPDF} from 'jspdf'
import {fixCodemirrorGutterStyle} from '@/codemirror-plugin/codeFix'

//-------------------------------内容加载处理------------------------------
function loadContentListener(store){
    const applicationContext = store.state.applicationContext

    //跟新上下文
    window.electronAPI.updateApplicationContext((event, context)=>{
        //跟新上下文
        store.commit('updateApplicationContext',context)
    })
    
    //保存文件回传处理
    window.electronAPI.saveFile((event,payload)=>{
        //IR模式需要提前转换文本
        if(store.state.editModel == "IR"){
            store.commit('updateContent',store.state.yaliEditor.getMarkdownText())
        }
        //回传信息
        if(payload){
            console.log('触发另存为');
            //回传上下文,设置另存路径(另存为)
            
            event.sender.send('saveFile',{
                applicationContext:JSON.stringify(applicationContext),
                path:payload.path
            })
        }else{
            //保存按键

            //回传上下文
            event.sender.send('saveFile',{
                applicationContext:JSON.stringify(applicationContext),
                path: null,
            })
            store.commit('updateFileState',true) //跟新文件状态为已经保存
        }
        

    })
    
    //创建文件树
    window.electronAPI.createFileTree((event, payload)=>{
        store.commit('updateTree',payload.tree)
    })

    //window.electronAPI.initFonts初始化字体 数据
    window.electronAPI.initFonts((event, fonts)=>{
        store.commit('initFonts',fonts)
    })

    window.electronAPI.exportPDF(()=>{
        //保存PDF
        let root = document.getElementById("YaliEditor")
        const doc = new jsPDF({
            unit:'px',
            orientation: 'p', 
            format: 'a4' 
        })
        doc.addFileToVFS('sourcehansans-normal.ttf',store.state.fonts.normal)
        doc.addFileToVFS('sourcehansans-bold.ttf',store.state.fonts.bold)
        doc.addFont('sourcehansans-normal.ttf','sourcehansans', 'normal')
        doc.addFont('sourcehansans-bold.ttf','sourcehansans', 'bold')
        doc.setFont('sourcehansans', 'normal');
        doc.setFont('sourcehansans', 'bold');
    

        //root.insertAdjacentHTML('afterbegin','<style>*{font-family:  Arial,sans-serif, serif,"sourcehansans";}</style>')
        let el = root.cloneNode(true)
        //给模块赋予字体
        let cList = el.children
        for (let index = 0; index < cList.length; index++) {
            const element = cList[index]
            element.style.fontFamily = "sourcehansans"
        }
        //给编辑器赋予字体
        let content = el.getElementsByClassName("cm-content")
        for (let index = 0; index < content.length; index++) {
            const element = content[index];
            element.style.fontFamily = "sourcehansans"
        }

        el.insertAdjacentHTML('afterbegin','<style>*{font-family:sourcehansans;}</style>')

        let mathDom = el.getElementsByClassName("markdown-it-mathjax-beautiful")
        for (let index = 0; index < mathDom.length; index++) {
            const element = mathDom[index];
            element.remove()
        }

        fixCodemirrorGutterStyle(el)

        doc.html(el, {
            jsPDF:doc,
            margin:[10,1000,10,30],
            width:400,
            windowWidth:1200
        }).save('undefine.pdf').then(o=>{
            //回复原来字体
            /*setTimeout(()=>{
                root.removeChild(root.firstChild)
            })*/
            
        });
    })

    window.electronAPI.exportIMG(()=>{
        //导出图片快照
        const write = document.getElementsByClassName("write")
        const e = write.item(0)
        fixCodemirrorGutterStyle(e)


        html2canvas(e,{
            height:e.scrollHeight,
            width:e.scrollWidth,
            scale:3
        }).then(cva=>{
            Canvas2Image.saveAsPNG(cva, e.scrollWidth+100, e.scrollHeight,document.title.replace("*",''))
        })
    })

    window.electronAPI.exportHTML(()=>{
        const write = document.getElementsByClassName("write").item(0)
        const clone = write.cloneNode(true)
        fixCodemirrorGutterStyle(clone)
        const styles = document.head.getElementsByTagName("style")
        let style = ''
        for (let index = 0; index < styles.length; index++) {
            const element = styles[index];
            style += element.outerHTML
        }

        //导出HTML
        window.electronAPI.saveHTMLFile({
           style: style,
           html:clone.outerHTML
        })
       //doc.body.innerHTML = write.outerHTML


       
    })


    window.electronAPI.openAuthorDetails(()=>{
        document.getElementById("dialog-author-details-button").click()
    })

    //测试
    window.electronAPI.test((event,payload)=>{
        console.log('测试，接收数据==',payload);
    })

}





//---------------------------viewEditor处理-----------------------------------
function loadViewEditorListener(store){
    //单行创建，如：h1
    window.electronAPI.createLine((event,payload)=>{
        //标题快捷键信息处理
        //payload.level
        //根据模式进行匹配
        if(store.state.editModel == "IR"){
            updateLineIR(store.state.yaliEditor.ir,payload)
        }else if(store.state.editModel == "SV"){
            updateLine(store.state.viewEditor,payload)
        }else{
            updateLine(store.state.viewEditor,payload)
        }
        


    })
    
    //字体创建
    window.electronAPI.createType((event,payload)=>{

        //字体快捷键信息处理
        if(store.state.editModel == "IR"){
            updateBlockIR(store.state.yaliEditor.ir,payload)
        }else if(store.state.editModel == "SV"){
            updateBlock(store.state.viewEditor,payload)
        }else{
            updateBlock(store.state.viewEditor,payload)
        }
        
    })
    
    //块级创建，如:代码块，字体块等
    window.electronAPI.createBlock((event,payload)=>{

        if(store.state.editModel == "IR"){
            updateBlockIR(store.state.yaliEditor.ir,payload)
        }else if(store.state.editModel == "SV"){
            updateBlock(store.state.viewEditor,payload)
        }else{
            updateBlock(store.state.viewEditor,payload)
        }
    })
    
    //多行创建 如,列表
    window.electronAPI.createMulLine((event,payload)=>{

        if(store.state.editModel == "IR"){
            updateMulLineIR(store.state.yaliEditor.ir,payload)
        }else if(store.state.editModel == "SV"){
            updateMulLine(store.state.viewEditor,payload)
        }else{
            updateMulLine(store.state.viewEditor,payload)
        }
    })

    //创建标题
    window.electronAPI.createToc(()=>{

        if(store.state.editModel == "IR"){
            createTocIR(store.state.yaliEditor.ir)
        }else if(store.state.editModel == "SV"){
            createToc(store.state.viewEditor)
        }else{
            createToc(store.state.viewEditor)
        }

    })

    //创建表格
    window.electronAPI.createTable(()=>{
        document.getElementById("dialog-form-button").click()
    })
}


function loadAll(store){

    loadContentListener(store)
    loadViewEditorListener(store)
}

export {loadAll,loadContentListener,loadViewEditorListener}
export default {loadAll,loadContentListener,loadViewEditorListener}

