import YaLiEditor from "..";
import { isMdBorder, isMdInlineFont, isMdInlineImg } from "../util/inspectElement";
import IRState from "./IRState";
import rangy from "rangy";


const fontCtrl = (IRState:Function) =>{

    IRState.prototype.fontInput = function(mdBlock,mdInline,event){
        return false
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