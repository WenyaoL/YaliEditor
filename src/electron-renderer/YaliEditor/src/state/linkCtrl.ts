import YaLiEditor from "..";
import { isMdBorder, isMdInlineImg, isMdInlineLink } from "../util/inspectElement";
import IRState from "./IRState";
import rangy from "rangy";


const linkCtrl = (IRState: Function) => {

    IRState.prototype.linkInput = function (mdBlock, mdInline, event) {
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0)
        const parent = r.startContainer.parentElement

        if (isMdBorder(parent) || parent == mdInline) {
            let mark = sel.getBookmark(mdBlock)
            this.linkRefresh(mdBlock, mdInline)
            mark.rangeBookmarks[0].containerNode = mdBlock
            sel.moveToBookmark(mark)
            mdBlock.normalize()
            this.editor.ir.focueProcessor.updateFocusElement()
            return true
        } else if (parent.classList.contains("md-link-url") && parent.nextElementSibling) { //修改的是链接（并且检测后面的边框完整性）
            mdInline.querySelector("a").href = encodeURI(parent.textContent)
            this.editor.ir.focueProcessor.updateFocusElement()
            return true
        }
        return false
    }

    IRState.prototype.linkDelete = function (mdBlock, mdInline) {
        return false
    }

    IRState.prototype.linkRefresh = function (mdBlock:HTMLElement, mdInline:HTMLElement) {
        if (!isMdInlineLink(mdInline)) return false;
        mdInline = this.editor.markdownTool.reRenderInlineElement(mdInline)
        if (!mdInline) return false
        return mdInline
    }

}

export default linkCtrl