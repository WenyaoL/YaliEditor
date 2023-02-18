
import { updateLine, updateBlock, updateMulLine, createToc } from '@/codemirror-plugin/util/Common'
import { updateLineIR, updateBlockIR, updateMulLineIR, createTocIR } from '@/YaliEditor/src/util/hotkeyProcess'
import html2canvas from 'html2canvas'
import Canvas2Image from './canvas2image'
import { jsPDF } from 'jspdf'
import { fixCodemirrorGutterStyle } from '@/codemirror-plugin/util/Common'
import { ElMessage, ElMessageBox } from 'element-plus'
import bus from '../bus'


class RendererIPMEventLoader {

    constructor(store) {
        this.store = store
        this.applicationContext = store.state.editorModule.applicationContext
    }

    init() {
        this.initExportFunctions(this.store)
        this.initApplicationContextLoadFunctions(this.store)
        this.initSaveFunctions(this.store)
        this.initCommonFunctions(this.store)
        this.initEditorFunctions(this.store)
    }

    /**
     * 导出功能的初始化
     */
    initExportFunctions(store) {
        window.electronAPI.ON.exportPDF(async () => {
            //保存PDF
            let root = document.getElementById("YaliEditor")
            const doc = new jsPDF({
                unit: 'px',
                orientation: 'p',
                format: 'a4'
            })

            if (!store.state.editorModule.fonts.normal) {
                const data = await store.dispatch('getFontsDate')
                store.state.editorModule.fonts.normal = data.normal
                doc.addFileToVFS('sourcehansans-normal.ttf', store.state.editorModule.fonts.normal)
                //doc.addFileToVFS('sourcehansans-bold.ttf', store.state.fonts.bold)
            }else{
                doc.addFileToVFS('sourcehansans-normal.ttf', store.state.editorModule.fonts.normal)
            }


            doc.addFont('sourcehansans-normal.ttf', 'sourcehansans', 'normal')
            //doc.addFont('sourcehansans-bold.ttf', 'sourcehansans', 'bold')
            doc.setFont('sourcehansans', 'normal');
            //doc.setFont('sourcehansans', 'bold');
            
            let el = root.cloneNode(true)
            //给模块赋予字体
            let cList = el.children
            for (let index = 0; index < cList.length; index++) {
                const element = cList[index]
                element.style.fontFamily = "sourcehansans"
            }
            //给编辑器赋予字体
            /*let content = el.getElementsByClassName("cm-content")
            for (let index = 0; index < content.length; index++) {
                const element = content[index];
                element.style.fontFamily = "sourcehansans"
            }*/

            el.insertAdjacentHTML('afterbegin', '<style>*{font-family:sourcehansans;}</style>')

            let mathDom = el.getElementsByClassName("markdown-it-mathjax-beautiful")
            for (let index = 0; index < mathDom.length; index++) {
                const element = mathDom[index];
                element.remove()
            }

            //fixCodemirrorGutterStyle(el)

            doc.html(el, {
                jsPDF: doc,
                margin: [10, 1000, 10, 30],
                width: 400,
                windowWidth: 1200
            }).save(document.title + '.pdf').then(o => {
                //回复原来字体
                /*setTimeout(()=>{
                    root.removeChild(root.firstChild)
                })*/

            });
        })

        window.electronAPI.ON.exportIMG(() => {
            //导出图片快照
            const write = document.getElementsByClassName("write").item(0)
            if (!write) retrun
            let e = write

            //fixCodemirrorGutterStyle(e)


            html2canvas(e, {
                windowHeight:760,
                windowWidth:1200,
                height: e.scrollHeight+10,
                width: e.scrollWidth+10,
                scale: 2,
                onclone:(cloneDocument)=>{
                    const codemirrors = cloneDocument.querySelectorAll(".markdown-it-code-beautiful")
                    codemirrors.forEach(element=>{
                        const id = element.id
                        const editor = this.store.state.editorModule.yaliEditor
                        const manager = editor.ir.renderer.codemirrorManager
                        const text = manager.getTextValue(id)
                        element.textContent = text
                    })
                }
            }).then(cva => {
                Canvas2Image.saveAsPNG(cva, e.scrollWidth + 100, e.scrollHeight, document.title.replace("*", ''))
            })
        })

        window.electronAPI.ON.exportHTML(() => {
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
            window.electronAPI.SEND.saveHTMLFile({
                style: style,
                html: clone.outerHTML
            })
            //doc.body.innerHTML = write.outerHTML
        })
    }

    /**
     * 上下文加载功能的初始化
     * @param {*} store 
     */
    initApplicationContextLoadFunctions(store) {


        //跟新上下文
        window.electronAPI.ON.setApplicationContext((event, context) => {
            if (context.theme) {
                document.documentElement.className = context.theme
                store.state.editorModule.yaliEditor.ir.selectTheme(context.theme)
            }
            //跟新上下文
            store.commit('updateApplicationContext', context)
        })

        window.electronAPI.ON.setKeyMap((event,keymap)=>{
            bus.emit('yali:updateKeyMap',keymap)
        })
    }

    /**
     * 保存功能的初始
     */
    initSaveFunctions(store) {
        //保存文件回传处理
        window.electronAPI.ON.saveFile((event) => {
            //IR模式需要提前转换文本
            if (store.state.editorModule.editModel == "IR") {
                store.commit('updateContent', store.state.editorModule.yaliEditor.getMarkdownText())
            }

            //回传上下文
            event.sender.send('renderer-saveFile', {
                applicationContext: JSON.stringify(this.applicationContext),
                savePath: null,
            })
            store.commit('updateFileState', true) //跟新文件状态为已经保存



        })

        window.electronAPI.ON.saveAsFile((event, { path }) => {
            //IR模式需要提前转换文本
            if (store.state.editorModule.editModel == "IR") {
                store.commit('updateContent', store.state.editorModule.yaliEditor.getMarkdownText())
            }

            if (!path) {
                window.electronAPI.INVOKE.openSaveMsgDialog().then(path => {
                    //回传上下文
                    event.sender.send('renderer-saveFile', {
                        applicationContext: JSON.stringify(this.applicationContext),
                        savePath: path,
                    })

                })
            } else {
                //回传上下文
                event.sender.send('renderer-saveFile', {
                    applicationContext: JSON.stringify(this.applicationContext),
                    savePath: path,
                })
            }

        })

    }

    /**
     * 其他通用功能
     */
    initCommonFunctions(store) {
        let currElMessageBox = null;
        //打开作者详情
        window.electronAPI.ON.openAuthorDetails(() => {
            document.getElementById("dialog-author-details-button").click()
        })

        //选择主题
        window.electronAPI.ON.setTheme((event, payload) => {
            document.documentElement.className = payload.type
            store.state.editorModule.yaliEditor.ir.selectTheme(payload.type)
            store.commit('updateTheme', payload.type)
        })

        window.electronAPI.ON.checkoutEditModel((event, payload) => {
            store.commit('updateEditModel', payload.editModel)
        })

        window.electronAPI.ON.checkoutSidebarDisplay((event, payload) => {
            bus.emit('sideBarChange')
        })

        //创建文件树
        window.electronAPI.ON.createFileTree((event, payload) => {
            store.commit('updateTree', payload.tree)
        })

        window.electronAPI.ON.closeWindow(() => {
            //IR模式需要提前转换文本
            if (store.state.editorModule.editModel == "IR") {
                store.commit('updateContent', store.state.editorModule.yaliEditor.getMarkdownText())
            }

            if (this.applicationContext.isSave) {
                //直接关闭窗口
                window.electronAPI.SEND.closeWindow()
            }

            if (currElMessageBox) return

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
                //关闭窗口并保存文件
                window.electronAPI.INVOKE.saveFile({
                    applicationContext: JSON.stringify(this.applicationContext),
                    path: ''
                }).then((flag) => {
                    currElMessageBox = null
                    if (flag) window.electronAPI.SEND.closeWindow()
                })

            }).catch((action) => {

                if (action === 'cancel') {
                    //直接关闭窗口
                    window.electronAPI.SEND.closeWindow()
                }
                currElMessageBox = null
            })

        })
    }

    /**
     * 初始化编辑器相关的功能
     */
    initEditorFunctions(store) {
        //单行创建，如：h1
        window.electronAPI.ON.createLine((event, payload) => {
            //标题快捷键信息处理
            //payload.level
            //根据模式进行匹配
            if (store.state.editorModule.editModel == "IR") {
                updateLineIR(store.state.editorModule.yaliEditor.ir, payload)
            } else if (store.state.editorModule.editModel == "SV") {
                updateLine(store.state.editorModule.viewEditor, payload)
            } else {
                updateLine(store.state.editorModule.viewEditor, payload)
            }
        })

        //字体创建
        window.electronAPI.ON.createType((event, payload) => {

            //字体快捷键信息处理
            if (store.state.editorModule.editModel == "IR") {
                updateBlockIR(store.state.editorModule.yaliEditor.ir, payload)
            } else if (store.state.editorModule.editModel == "SV") {
                updateBlock(store.state.editorModule.viewEditor, payload)
            } else {
                updateBlock(store.state.editorModule.viewEditor, payload)
            }

        })

        //块级创建，如:代码块，字体块等
        window.electronAPI.ON.createBlock((event, payload) => {

            if (store.state.editorModule.editModel == "IR") {
                updateBlockIR(store.state.editorModule.yaliEditor.ir, payload)
            } else if (store.state.editorModule.editModel == "SV") {
                updateBlock(store.state.editorModule.viewEditor, payload)
            } else {
                updateBlock(store.state.editorModule.viewEditor, payload)
            }
        })

        //多行创建 如,列表
        window.electronAPI.ON.createMulLine((event, payload) => {

            if (store.state.editorModule.editModel == "IR") {
                updateMulLineIR(store.state.editorModule.yaliEditor.ir, payload)
            } else if (store.state.editorModule.editModel == "SV") {
                updateMulLine(store.state.editorModule.viewEditor, payload)
            } else {
                updateMulLine(store.state.editorModule.viewEditor, payload)
            }
        })

        //创建标题
        window.electronAPI.ON.createToc(() => {

            if (store.state.editorModule.editModel == "IR") {
                createTocIR(store.state.editorModule.yaliEditor.ir)
            } else if (store.state.editorModule.editModel == "SV") {
                createToc(store.state.editorModule.viewEditor)
            } else {
                createToc(store.state.editorModule.viewEditor)
            }

        })

        //创建表格
        window.electronAPI.ON.createTable(() => {
            document.getElementById("dialog-form-button").click()
        })
    }

}





export { RendererIPMEventLoader }
export default RendererIPMEventLoader

