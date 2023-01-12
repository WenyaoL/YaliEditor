/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { KeyProcessor } from "./KeyProcessor";
import Constants from "../constant/constants";
import {
    IRfindClosestLi,
} from "../util/findElement";
import {isMdBlockParagraph} from '../util/inspectElement'

import YaLiEditor from "..";
import { strToElement } from "../util/createElement";
import rangy from "rangy";

class IREnterkeyProcessor implements KeyProcessor{

    editor:YaLiEditor
    constructor(editor:YaLiEditor){
        this.editor = editor
    }

    isNotHandle(inline:HTMLElement|null,block:HTMLElement|null,top:HTMLElement|null){
        //光标是否在公式块里面
        if(block && block.tagName === "PRE") return true
        
        //光标是否在math块里面
        if(top && top.classList.contains("markdown-it-mathjax-beautiful")) return true;
    }

    inlineHandle(inline:HTMLElement|null,block:HTMLElement|null,top:HTMLElement|null){
        let e = inline;
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange

        //如果是链接
        if(e && e.getAttribute(Constants.ATTR_MD_INLINE) == Constants.ATTR_MD_INLINE_LINK){
            if(block) e = block
            //后半块处理
            r.setEndAfter(e);
            //剪切
            let content = r.extractContents()
            //重新渲染
            let link = this.editor.ir.reRenderElement(content.firstElementChild)
            content.replaceChildren(strToElement(link))
            r.collapseAfter(e);
            r.insertNode(content);
            r.collapseToPoint(e.nextElementSibling,0)
            //给光标打标志
            const bookMark = sel.getBookmark(e.nextElementSibling)

            //前半块处理
            r.selectNode(e)
            //剪切
            content = r.extractContents()
            //重新渲染
            link = this.editor.ir.reRenderElement(content.firstElementChild)
            content.replaceChildren(strToElement(link))
            r.insertNode(content);
            sel.moveToBookmark(bookMark)
            return true
        }


        return false
    }

    blockHandle(inline:HTMLElement|null,block:HTMLElement|null,top:HTMLElement|null){
        let e = block;
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange

        //光标是否聚合（坍塌）
        if(!r.collapsed) r.deleteContents()

        //光标是否在li上
        let li = IRfindClosestLi(e)
        if(li) {
            e = li;
            r.setEndAfter(e);
            //剪切
            let content = r.extractContents()
            //剪切导致li空缺
            if(e.tagName === "LI" && e.childElementCount===0){
                //插入P标签
                e.insertAdjacentHTML("beforeend",'<p md-block="paragraph"></p>')
            }
            r.collapseAfter(e);
            r.insertNode(content);
            r.collapseToPoint(e.nextElementSibling,0)
            sel.setSingleRange(r);
            
            return true
        }

        //光标是否在table表格里面
        if(block?.getAttribute(Constants.ATTR_MD_BLOCK) == Constants.ATTR_MD_BLOCK_TABLE){ 
            return true
        }



        //是否在一般标签的头部
        if(r.endOffset === 0){
            r.collapseBefore(e)
            const p = document.createElement("p")
            p.setAttribute("md-block","paragraph")
            //p.innerHTML = "<br>"
            r.insertNode(p)
            return true
        }

        r.setEndAfter(e);
        //剪切
        let content = r.extractContents()
        //剪切出的长度为0，证明在尾部
        if(content.textContent?.length ===0){
            r.collapseAfter(e)
            const p = document.createElement("p")
            //p.innerHTML = "<br>"
            p.setAttribute("md-block","paragraph")
            r.insertNode(p)
            //光标选择聚焦新元素
            rangy.getSelection().collapse(p,0)
            return true
        }

        r.collapseAfter(e);
        r.insertNode(content);
        r.collapseToPoint(e.nextElementSibling,0)
        sel.setSingleRange(r);
        return true
    }





    enter(){
        const sel = rangy.getSelection()
        let r = sel.getRangeAt(0).cloneRange()

        //光标没聚合
        if(!r.collapsed) {
            //范围删除
            this.editor.ir.deletekeyProcessor.deleteRang()
        }

        let block = this.editor.ir.focueProcessor.getSelectedBlockMdElement()
        const li = IRfindClosestLi(block)
        if(li){
            let {end} = this.editor.domTool.splitElementAtCursor(li)
            sel.collapse(end.firstElementChild,0)
            return true
        }

        
        
        r = sel.getRangeAt(0).cloneRange()
        const p = document.createElement("p")
        p.setAttribute("md-block","paragraph")
        //是否在一般标签的尾部
        if(r.startOffset === r.startContainer.textContent.length){
            this.editor.domTool.insertElementAfterElement(block,p)
            sel.collapse(p,0)
            return true
        }else if(r.startOffset === 0){
            this.editor.domTool.insertElementBeforeElement(block,p)
            return true
        }else{
            let {start,end} = this.editor.domTool.splitElementAtCursor(block)
            if(isMdBlockParagraph(start)) this.editor.markdownTool.reRenderInlineElementAtBlock(start as HTMLElement)
            if(isMdBlockParagraph(end)) this.editor.markdownTool.reRenderInlineElementAtBlock(end as HTMLElement)
            sel.collapse(end,0)
            return true
        }
    }

    execute(event: KeyboardEvent) {
        //修改动作前的跟新
        this.editor.ir.focueProcessor.updateBeforeModify()
        this.enter()
        event.preventDefault()
        /*const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange()
        let start =  r.startContainer

        
        let inline = IRfindClosestMdInline(start)
        let block = IRfindClosestMdBlock(start)
        let top = IRfindClosestTop(start)
        
        if(this.isNotHandle(inline,block,top)) return
        else if(this.inlineHandle(inline,block,top)){
            event.preventDefault()
            return
        }else if(this.blockHandle(inline,block,top)){
            event.preventDefault()
            return
        }*/
    }

}



export default IREnterkeyProcessor