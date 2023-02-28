import { getUniqueKey } from "@/markdown-it-plugin/markdown-it-key-generator"
import rangy from "rangy"

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


    IRState.prototype.listItmeDelete = function () {
        return true
    }

    IRState.prototype.listItmeEnter = function (li) {
        
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