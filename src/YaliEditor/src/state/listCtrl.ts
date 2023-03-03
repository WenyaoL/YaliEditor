import { getUniqueKey } from "@/markdown-it-plugin/markdown-it-key-generator"
import rangy from "rangy"
import YaLiEditor from ".."
import { isMdBlockFence, isMdBlockMath, isMdBlockParagraph } from "../util/inspectElement"

const listCtrl = IRState => {

    IRState.prototype.listDelete = function (mdBlock) {
        return true
    }

    IRState.prototype.listEnter = function (mdBlock) {
        return true
    }

    IRState.prototype.listInput = function (mdBlock, mdInline, event) {
        return true
    }


    IRState.prototype.listItmeDelete = function (li:HTMLElement) {
        const editor =  this.editor as YaLiEditor
        const block = editor.ir.focueProcessor.getSelectedBlockMdElement(false)

        if(block && isMdBlockParagraph(block) && this.editor.domTool.isTextEmptyElement(block) && !block.nextElementSibling && !block.previousElementSibling){
            const ul = li.parentElement
            li.remove()
            if(ul.childElementCount == 0){
                const p = editor.markdownTool.nodeDegenerateToP(ul)
                p.focus()
            }
            return true
        }

        return false
    }

    IRState.prototype.listItmeEnter = function (li) {
        
        const editor =  this.editor as YaLiEditor
        const block = editor.ir.focueProcessor.getSelectedBlockMdElement(false)

        if(isMdBlockFence(block) || isMdBlockMath(block)) return false

        const sel = rangy.getSelection()
        let { start, end } = this.editor.domTool.splitElementAtCursor(li)
        
        end.setAttribute("mid", getUniqueKey() + "")
        end.querySelector("p").setAttribute("mid", getUniqueKey() + "")
        this.editor.markdownTool.reRenderInlineElementAtBlock(start.firstElementChild as HTMLElement)
        this.editor.markdownTool.reRenderInlineElementAtBlock(end.firstElementChild as HTMLElement)
        sel.collapse(end.firstElementChild, 0)
        
        return true
    }

    IRState.prototype.listItmeInput = function () {
        return true
    }
}

export default listCtrl