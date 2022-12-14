
import {updateLine,updateBlock,updateMulLine,createToc} from '@/codemirror-plugin/util/Common'
import {updateLineIR,updateBlockIR,updateMulLineIR, createTocIR} from '@/YaliEditor/src/util/hotkeyProcess' 
import html2canvas from 'html2canvas'
import Canvas2Image from './canvas2image'
import {jsPDF} from 'jspdf'
import {fixCodemirrorGutterStyle} from '@/codemirror-plugin/util/Common'
import { ElMessage, ElMessageBox } from 'element-plus'



class RendererIPMEventLoader{

    constructor(store){
        this.store = store
        this.applicationContext = store.state.applicationContext
    }

    init(){
        this.initExportFunctions(this.store)
        this.initApplicationContextLoadFunctions(this.store)
        this.initSaveFunctions(this.store)
        this.initCommonFunctions(this.store)
        this.initEditorFunctions(this.store)
    }

    /**
     * 导出功能的初始化
     */
    initExportFunctions(store){
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

            //fixCodemirrorGutterStyle(el)

            doc.html(el, {
                jsPDF:doc,
                margin:[10,1000,10,30],
                width:400,
                windowWidth:1200
            }).save(document.title+'.pdf').then(o=>{
                //回复原来字体
                /*setTimeout(()=>{
                    root.removeChild(root.firstChild)
                })*/
                
            });
        })

        window.electronAPI.exportIMG(()=>{
            //导出图片快照
            const write = document.getElementsByClassName("write").item(0)
            if(!write) retrun
            let e = write

            //fixCodemirrorGutterStyle(e)


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
            //fixCodemirrorGutterStyle(clone)
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
    }

    /**
     * 上下文加载功能的初始化
     * @param {*} store 
     */
    initApplicationContextLoadFunctions(store){

        //window.electronAPI.initFonts初始化字体 数据
        window.electronAPI.initFonts((event, fonts)=>{
            store.commit('initFonts',fonts)
        })

        //跟新上下文
        window.electronAPI.updateApplicationContext((event, context)=>{
            if(context.theme){
                document.documentElement.className = context.theme
                store.state.yaliEditor.ir.selectTheme(context.theme)
            }
            //跟新上下文
            store.commit('updateApplicationContext',context)
        })
    }

    /**
     * 保存功能的初始
     */
    initSaveFunctions(store){
        //保存文件回传处理
        window.electronAPI.saveFile((event,payload)=>{
            //IR模式需要提前转换文本
            if(store.state.editModel == "IR"){
                store.commit('updateContent',store.state.yaliEditor.getMarkdownText())
            }
            //回传信息
            if(payload){
                //回传上下文,设置另存路径(另存为)
                event.sender.send('saveFile',{
                    applicationContext:JSON.stringify(this.applicationContext),
                    path:payload.path,
                    closeWindow:payload.closeWindow
                })
            }else{
                //保存按键

                //回传上下文
                event.sender.send('saveFile',{
                    applicationContext:JSON.stringify(this.applicationContext),
                    path: null,
                })
                store.commit('updateFileState',true) //跟新文件状态为已经保存
            }
            

        })
    }

    /**
     * 其他通用功能
     */
    initCommonFunctions(store){
        let currElMessageBox = null;
        //打开作者详情
        window.electronAPI.openAuthorDetails(()=>{
            document.getElementById("dialog-author-details-button").click()
        })

        //选择主题
        window.electronAPI.selectTheme((event,payload)=>{
            document.documentElement.className = payload.type
            store.state.yaliEditor.ir.selectTheme(payload.type)
            store.commit('updateTheme',payload.type)
        })

        window.electronAPI.checkoutEditModel((event,payload)=>{
            store.commit('updateEditModel',payload.editModel)
        })

        window.electronAPI.checkoutSidebarDisplay((event,payload)=>{
            store.commit('updateSideBarHiden',!store.state.sideBarHiden)
        })

        //创建文件树
        window.electronAPI.createFileTree((event, payload)=>{
            store.commit('updateTree',payload.tree)
        })

        window.electronAPI.closeWindow(()=>{
            //IR模式需要提前转换文本
            if(store.state.editModel == "IR"){
                store.commit('updateContent',store.state.yaliEditor.getMarkdownText())
            }

            if(this.applicationContext.isSave){
                //直接关闭窗口
                window.electronAPI.invokeCloseWin()
            }

            if(currElMessageBox) return

            //调用消息盒子提示是否要保存文件
            currElMessageBox = ElMessageBox.confirm(
                '是否保存更,不保存将丢弃更改',
                '保存',
                {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '保存',
                    cancelButtonText: '丢弃',
                }
                ).then(() => {
                    console.log("关闭并保持文件");
                    //关闭窗口并保存文件
                    window.electronAPI.invokeSave({
                        applicationContext:JSON.stringify(this.applicationContext),
                        closeWindow:true
                    })
                    currElMessageBox = null
                }).catch((action) => {
                    if(action === 'cancel'){
                        //直接关闭窗口
                        window.electronAPI.invokeCloseWin()
                    }
                    currElMessageBox = null
            })

        })
    }

    /**
     * 初始化编辑器相关的功能
     */
    initEditorFunctions(store){
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

}





export {RendererIPMEventLoader}
export default RendererIPMEventLoader

