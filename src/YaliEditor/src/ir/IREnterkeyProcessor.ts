/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { KeyProcessor } from "./KeyProcessor";
import Constants from "../constant/constants";
import {
    IRfindClosestLi, IRfindClosestQuote,
} from "../util/findElement";
import { isMdBlockCode, isMdBlockFence, isMdBlockHeading, isMdBlockHTML, isMdBlockListItem, isMdBlockMath, isMdBlockMeta, isMdBlockParagraph, isMdBlockQuote, isMdInlineEmoji, isMdInlineFont, isMdInlineImg, isMdInlineLink } from '../util/inspectElement'

import YaLiEditor from "..";
import rangy from "rangy";
import { getUniqueKey } from "@/markdown-it-plugin/markdown-it-key-generator";

class IREnterkeyProcessor implements KeyProcessor {

    editor: YaLiEditor
    constructor(editor: YaLiEditor) {
        this.editor = editor
    }

    enter() {
        const sel = rangy.getSelection()
        let r = sel.getRangeAt(0).cloneRange()

        //光标没聚合
        if (!r.collapsed) {
            //范围删除
            this.editor.ir.deletekeyProcessor.deleteRang()
        }

        let mdBlock = this.editor.ir.focueProcessor.getSelectedBlockMdElement()
        let mdInline = this.editor.ir.focueProcessor.getSelectedInlineMdElement()

        if(isMdInlineEmoji(mdInline) && this.editor.ir.state.emojiEnter(mdBlock, mdInline, event)){
            this.editor.ir.observer.flush()
            return true
        }


        if (isMdBlockParagraph(mdBlock) && this.editor.ir.state.paragraphEnter(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdBlockHeading(mdBlock) && this.editor.ir.state.headingEnter(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdBlockFence(mdBlock) && this.editor.ir.state.fenceEnter(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdBlockMath(mdBlock) && this.editor.ir.state.mathBlockEnter(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdBlockHTML(mdBlock) && this.editor.ir.state.htmlBlockEnter(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdBlockMeta(mdBlock) && this.editor.ir.state.metaBlockEnter(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdBlockCode(mdBlock) && this.editor.ir.state.codeBlockEnter(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        }


        const li = IRfindClosestLi(mdBlock)
        const quote = IRfindClosestQuote(mdBlock)
        if (isMdBlockListItem(li) && this.editor.ir.state.listItmeEnter(li, mdInline)) { 
            this.editor.ir.observer.flush()
            return true 
        }else if(isMdBlockQuote(quote) && this.editor.ir.state.quoteBlockEnter(quote,mdInline)) { 
            this.editor.ir.observer.flush()
            return true 
        }

        return false
    }

    execute(event: KeyboardEvent) {
        //修改动作前的跟新
        this.editor.ir.focueProcessor.updateBeforeModify()
        if (this.enter()) {
            event.preventDefault()
        }
        this.editor.ir.observer.flush()
    }

}



export default IREnterkeyProcessor