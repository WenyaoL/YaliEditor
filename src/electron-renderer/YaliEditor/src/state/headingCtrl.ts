import YaLiEditor from "..";
import { isMdBlockHr, isMdBlockListItem, isMdBlockParagraph } from "../util/inspectElement";
import IRState from "./IRState";
import rangy from "rangy";
import { createParagraph } from "../util/createElement";
import { getUniqueKey } from "../plugin/markdown-it-plugin/markdown-it-key-generator";
import constants from "../constant/constants";

const headingCtrl = IRState => {

    IRState.prototype.headingDelete = function (mdBlock) {
        return false
    }

    IRState.prototype.headingEnter = function (mdBlock) {
        return this.paragraphEnter(mdBlock)
    }

    IRState.prototype.headingInput = function (mdBlock, mdInline, event) {

        this.editor.ir.applicationEventPublisher.AsynPublish(constants.IR_EVENT_REFRESHTOC)

        if (event.data == " ") {
            return true
        }
        const sel = rangy.getSelection()
        const mark = sel.getBookmark(mdBlock)
        const block = this.headingRefresh(mdBlock, mdInline)
        if(block) mark.rangeBookmarks[0].containerNode = block
        try{
            sel.moveToBookmark(mark)
        }catch(err){
            sel.collapse(mdBlock, mdBlock.childNodes.length)
        }
        this.editor.ir.focueProcessor.updateFocusElement()
        return block
    }

    IRState.prototype.headingRefresh = function (mdBlock:HTMLElement, mdInline) {

        //剩下<br>不处理
        if(mdBlock.innerText=="" || mdBlock.innerText=="\n") return mdBlock


        //尝试刷新行内的所有文本
        if (this.editor.markdownTool.reRenderInlineElementAtBlock(mdBlock)) {
            //this.editor.ir.focueProcessor.updateFocusElement()
            return mdBlock
        }

        return mdBlock
    }
}

export default headingCtrl