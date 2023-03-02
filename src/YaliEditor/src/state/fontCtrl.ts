import YaLiEditor from "..";
import { isMdBorder, isMdInlineFont, isMdInlineImg } from "../util/inspectElement";
import IRState from "./IRState";
import rangy from "rangy";


const fontCtrl = (IRState:Function) =>{

    IRState.prototype.fontInput = function(mdBlock,mdInline,event){
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0)
        const editor = (this.editor) as YaLiEditor
        const mark = r.getBookmark(mdBlock)
        
        const inline = this.fontRefresh(mdBlock,mdInline)

        if(!inline) return false;

        try {
            r.moveToBookmark(mark)
            sel.setSingleRange(r)
            
        } catch (err) {
            sel.collapse(inline, inline.childNodes.length)
        }
        editor.ir.focueProcessor.updateFocusMdInlineByStart()
        return true
    }

    IRState.prototype.fontDelete = function(mdBlock,mdInline){
        return false
    }

    IRState.prototype.fontRefresh = function(mdBlock,mdInline){
        mdInline = this.editor.markdownTool.reRenderInlineElement(mdInline) as HTMLElement
        if (!mdInline) return false
        return mdInline
    }

}

export default fontCtrl