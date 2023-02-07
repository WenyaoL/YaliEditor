/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import YaliEditor from '../index'
import rangy from "rangy";
import {strToElementList,strToElementArray, strToDocumentFragment} from "../util/createElement"
import Constants from "../constant/constants"
import Reg from '../constant/reg'
import {axiosInstance} from '../axios'
import { isMdBlockFence, isMdBlockHTML, isMdBlockMath } from '../util/inspectElement';
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
        if(!selBlock){
            selBlock = this.editor.ir.focueProcessor.getSelectedBlockMdElement()
        }
        
        const {start,end} = this.editor.domTool.splitElementAtCursor(selBlock,df)
        this.editor.markdownTool.reRenderNode(start as HTMLElement)
        this.editor.markdownTool.reRenderNode(end as HTMLElement)

        
        this.editor.ir.renderer.codemirrorManager.refreshEditorView().then(()=>{
            this.editor.ir.focueProcessor.update()
            this.editor.ir.observer.forceFlush()
            this.editor.ir.applicationEventPublisher.publish(Constants.IR_EVENT_REFRESHTOC)
        })
    }

    /**
     * 插入纯文本
     * @param str 
     */
    pasteText(str:string){
        this.editor.domTool.insertTextNodeAtCursor(str)
        this.editor.ir.contextRefresher.refreshFocusInline()
    }

    /**
     * 文本粘贴处理
     */
    pasteTextPlain(str:string){
        let mdinlineType = this.editor.ir.focueProcessor.getSelectedInlineMdType(false)

        if(Reg.urlReg.test(str)){ //link
            if(mdinlineType){ 
                this.pasteText(str)
                return
            }

            axiosInstance.get(str).then(response=>{
                const res = Reg.htmlTitleReg.exec(response.data).at(0)
                if(res){
                    const link = this.editor.markdownTool.renderInline(`[${res}](${str})`)
                    this.editor.domTool.insertElementAtCursor(link)
                }else{
                    const link = this.editor.markdownTool.renderInline(str)
                    this.editor.domTool.insertElementAtCursor(link)
                }   
            }).catch(()=>{
                const link = this.editor.markdownTool.renderInline(str)
                this.editor.domTool.insertElementAtCursor(link)
            })

            
        }else{
            //将文本当成markdown字符串进行处理
            this.pasteMarkdown(str)
        }  
    }

    execute(event: ClipboardEvent) {
        let sel = rangy.getSelection()
        let markdown = event.clipboardData?.getData('text/markdown')

        let block = this.editor.ir.focueProcessor.getSelectedBlockMdElement(false)
        if(isMdBlockFence(block) || isMdBlockMath(block) || isMdBlockHTML(block)){
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
            this.editor.ir.contextRefresher.refreshFocusInline(true)
        }
        //这里会导致系统的输入和粘贴的默认行为得到阻止
        event.preventDefault()
        
        this.editor.ir.observer.forceFlush()
    }  
}

export default IRPasteProcessor;