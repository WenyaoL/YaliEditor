/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { KeyProcessor } from "./KeyProcessor";
import Constants from "../constant/constants";
import {
    IRfindClosestLi,
} from "../util/findElement";
import {isMdBlockFence, isMdBlockMath, isMdBlockParagraph} from '../util/inspectElement'

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







    enter(){
        const sel = rangy.getSelection()
        let r = sel.getRangeAt(0).cloneRange()

        //光标没聚合
        if(!r.collapsed) {
            //范围删除
            this.editor.ir.deletekeyProcessor.deleteRang()
        }

        let block = this.editor.ir.focueProcessor.getSelectedBlockMdElement()
        if(isMdBlockFence(block) || isMdBlockMath(block)) return false

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
            else this.editor.markdownTool.reRenderBlockElement(start as HTMLElement)

            if(isMdBlockParagraph(end)) this.editor.markdownTool.reRenderInlineElementAtBlock(end as HTMLElement)
            else end = this.editor.markdownTool.reRenderBlockElement(end as HTMLElement) as HTMLElement

            sel.collapse(end,0)
            return true
        }
    }

    execute(event: KeyboardEvent) {
        //修改动作前的跟新
        this.editor.ir.focueProcessor.updateBeforeModify()
        if(this.enter()) event.preventDefault()

    }

}



export default IREnterkeyProcessor