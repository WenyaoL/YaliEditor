/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import YaliEditor from '../index'
import rangy from "rangy";
import {strToElementList} from "../util/inspectElement"
class IRPasteProcessor{

    public editor:YaliEditor;
    constructor(editor:YaliEditor){
        this.editor = editor;
    }

    /**
     * 删除选中的内容
     */
    private deleteSelected(){
        let sel = rangy.getSelection()
        sel.deleteFromDocument()
    }

    /**
     * 先删除后粘贴markdown文本
     */
    pasteMarkdownAfterDelete(str:string){
        //删除内容
        this.deleteSelected()
        this.pasteMarkdown(str)
    }

    pasteTextPlainAfterDelete(str:string){
        //删除内容
        this.deleteSelected()
        this.pasteTextPlain(str)
    }
    
    /**
     * markdown 文本粘贴
     * @param str 
     * @returns 
     */
    pasteMarkdown(str:string){
        if(!str) return

        let sel = rangy.getSelection()
        let r = sel.getRangeAt(0)

        //翻译成markdown元素
        let markdown = this.editor.ir.renderer.render(str)
        
        //返回翻译元素
        let eList = strToElementList(markdown)
        //document碎片，一次性渲染，提高性能
        let doc = document.createDocumentFragment()
        //最后的node(用于粘贴后，重新定位光标到最后面)
        let lastNode:Node =null
        //只有一个P元素，特殊处理
        if(eList.length == 1 && eList.item(0).tagName == "P"){
            const element = eList.item(0)
            let arr:Node[] = Array.prototype.slice.call(element.childNodes,0)
            lastNode = arr[arr.length-1]
            doc.replaceChildren(...arr)
        }else{
            //多个标签
            r.setEndAfter(this.editor.ir.focueProcessor.getSelectedBlockMdElement())
            doc = r.extractContents()
            let list:Node[] = Array.prototype.slice.call(eList,0)
            let extractList:Node[] = Array.prototype.slice.call(doc.childNodes,0)
            doc.replaceChildren(...list,...extractList)
            lastNode = list[list.length-1]
        }

        
        r.insertNode(doc)
        if(lastNode.nodeType == 3){

            r.collapseToPoint(lastNode,lastNode.textContent.length)
        }else{
            r.collapseToPoint(lastNode,lastNode.childNodes.length)
        }
        sel.setSingleRange(r)
        this.editor.ir.renderer.codemirrorManager.initEditorView(this.editor.ir.rootElement)
    }

    /**
     * 文本粘贴
     */
    pasteTextPlain(str:string){
        let sel = rangy.getSelection()
        let r = sel.getRangeAt(0)
        let text = document.createTextNode(str)
        r.insertNode(text)
        r.collapseAfter(text)
        sel.setSingleRange(r)
    }

    execute(event: ClipboardEvent) {
        let sel = rangy.getSelection()
        let str = event.clipboardData?.getData('text/markdown')



        if(str.length != 0){
            //光标是否聚合
            if(sel.isCollapsed){
                this.pasteMarkdown(str)
            }else{
                this.pasteMarkdownAfterDelete(str)
            }
        }else{
            str = event.clipboardData?.getData('text/plain')
            //光标是否聚合
            if(sel.isCollapsed){
                this.pasteTextPlain(str)
            }else{
                this.pasteTextPlainAfterDelete(str)
            }

        }
        
        event.preventDefault()
    }  
}

export default IRPasteProcessor;