import YaLiEditor from "..";
import Reg from "../constant/reg";
import { strToElement } from "../util/createElement";
import rangy from "rangy";
import { IRfindClosestMdInline } from "../util/findElement";

class IRDragProcessor {
    editor: YaLiEditor;
    
    constructor(editor:YaLiEditor) {
        this.editor = editor
    }

    

    drop(ev: DragEvent){
        const items = ev.dataTransfer.items
        
        for (let index = 0; index < items.length; index++) {
            const data = items[index];
            //文件
            if(data.kind === "file"){
                const file = data.getAsFile() as File & { path: string }
                const fileName = file.name
                //img图片
                if(Reg.imgReg.test(fileName)){
                    this.dropImgFile(file)
                    ev.preventDefault()
                }else if(Reg.markdownReg.test(fileName)){ //markdown文件
                    this.dropMarkdownFile(file)
                    ev.preventDefault()
                }
            }else{/**字符串拖拽 */
                //禁止拖拽
                ev.preventDefault()
            }
        }
    }

    dropMarkdownFile(file:File & { path: string }){
        if(!file.path) return
        //请求外部打开文件
        this.editor.ir.applicationEventPublisher.publish('yali::openFile',file.path)
    }

    dropImgFile(img: File & { path: string }) {
        if (!img.path) return
        
        let render = this.editor.markdownTool.renderInline("![](" + img.path + ")")
        let e = strToElement(render)
        if (!e) return false
        let sel = rangy.getSelection()
        let r = sel.getRangeAt(0).cloneRange()
        r.insertNode(e)
        this.editor.ir.observer.forceFlush()
        return true
    }

    execute(ev: DragEvent){
        this.drop(ev)
    }

}

export default IRDragProcessor