/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import YaliEditor from '../index'
import rangy from "rangy";
import {strToElementList,strToElementArray, strToDocumentFragment} from "../util/createElement"
import Constants from "../constant/constants"
import Reg from '../constant/reg'
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

        //首先当成Block进行渲染
        const block = this.editor.markdownTool.renderBlock(str)
        const df = strToDocumentFragment(block)
        
        //如果只是单纯的P文本文段，当成Inline规则进行渲染
        if(df.children.length == 1 && df.children.item(0).tagName == "P"){
            const inline = this.editor.markdownTool.renderInline(str)
            this.editor.domTool.insertAdjacentHTMLAtCursor(inline)
            return
        }

        let selBlock = this.editor.ir.focueProcessor.getSelectedBlockMdElement()
        if(selBlock){
            this.editor.ir.focueProcessor.updateFocusElement()
            selBlock = this.editor.ir.focueProcessor.getSelectedBlockMdElement()
        }
        
        
        const {start,end} = this.editor.domTool.splitElementAtCursor(selBlock,df)
        this.editor.markdownTool.reRenderNode(start as HTMLElement)
        this.editor.markdownTool.reRenderNode(end as HTMLElement)

        
        this.editor.ir.renderer.codemirrorManager.refreshEditorView().then(()=>{
            this.editor.ir.focueProcessor.update()
            this.editor.ir.observer.forceFlush()
            this.editor.ir.applicationEventPublisher.publish("refreshToc")
        })
    }

    /**
     * 文本粘贴
     */
    pasteTextPlain(str:string){

        if(Reg.urlReg.test(str)){ //link
            const link = this.editor.markdownTool.renderInline(str)
            this.editor.domTool.insertElementAtCursor(link)
        }else{
            //将文本当成markdown字符串进行处理
            this.pasteMarkdown(str)
        }  
    }

    execute(event: ClipboardEvent) {
        let sel = rangy.getSelection()
        let markdown = event.clipboardData?.getData('text/markdown')

        let type = this.editor.ir.focueProcessor.getSelectedBlockMdType()
        if(type == Constants.ATTR_MD_BLOCK_FENCE){
            return
        }

        if(markdown.length != 0){
            //光标是否聚合
            if(sel.isCollapsed){
                this.pasteMarkdown(markdown)
            }else{
                this.pasteMarkdownAfterDelete(markdown)
            }
        }else{
            let text = event.clipboardData?.getData('text/plain')
            //光标是否聚合
            if(sel.isCollapsed){
                this.pasteTextPlain(text)
            }else{
                this.pasteTextPlainAfterDelete(text)
            }

        }
        
        event.preventDefault()
    }  
}

export default IRPasteProcessor;