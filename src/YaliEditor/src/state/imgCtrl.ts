import YaLiEditor from "..";
import { isMdBorder, isMdInlineImg } from "../util/inspectElement";
import IRState from "./IRState";
import rangy from "rangy";


const imgCtrl = (IRState: Function) => {
    IRState.prototype.imgInput = function (mdBlock, mdInline, event) {
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0)
        const parent = r.startContainer.parentElement

        if (isMdBorder(parent)) {
            let mark = sel.getBookmark(mdBlock)
            this.imgRefresh(mdBlock, mdInline)
            mark.rangeBookmarks[0].containerNode = mdBlock
            sel.moveToBookmark(mark)
            mdBlock.normalize()
            this.editor.ir.focueProcessor.updateFocusElement()
            return true
        } else if (parent.classList.contains("md-info") && parent.nextElementSibling.textContent == "](") { //修改的是描述信息（并且检测后面的边框完整性）
            mdInline.querySelector("img").alt = parent.textContent
            this.editor.ir.focueProcessor.updateFocusElement()
            return true
        } else if (parent.classList.contains("md-img-url") && parent.nextElementSibling) { //修改的是链接（并且检测后面的边框完整性）
            mdInline.querySelector("img").src = parent.textContent
            this.editor.ir.focueProcessor.updateFocusElement()
            return true
        }
        return false
    }

    IRState.prototype.imgDelete = function (mdBlock, mdInline) {
        return false
    }

    IRState.prototype.imgRefresh = function (mdBlock, mdInline) {
        if (!isMdInlineImg(mdInline)) return false;
        mdInline = this.editor.markdownTool.reRenderInlineElement(mdInline) as HTMLElement
        if (!mdInline) return false
        return mdInline
    }
}

export default imgCtrl