import YaLiEditor from "..";
import { isMdBlockFence, isMdBlockHr, isMdBlockListItem, isMdBlockMath, isMdBlockParagraph, isMdInlineFont, isMdInlineLink } from "../util/inspectElement";
import IRState from "./IRState";
import rangy from "rangy";
import { createParagraph } from "../util/createElement";
import { getUniqueKey } from "@/markdown-it-plugin/markdown-it-key-generator";
import { IRfindClosestLi } from "../util/findElement";

const paragraphCtrl = IRState => {

    IRState.prototype.paragraphDelete = function (mdBlock: HTMLElement) {

        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        const start = r.startContainer
        const mdBlockPreviousElement = mdBlock.previousElementSibling



        //在listItem下，交付给listItem处理
        if (this.editor.domTool.isTextEmptyElement(mdBlock) && isMdBlockListItem(mdBlock.parentElement)) {
            return false
        }

        //临近Hr附近
        if (this.editor.domTool.isTextEmptyElement(mdBlock) && isMdBlockHr(mdBlockPreviousElement)) {
            mdBlockPreviousElement.remove()
            return true
        }

        //临近LI附件
        if (this.editor.domTool.isTextEmptyElement(mdBlock) && isMdBlockListItem(mdBlockPreviousElement)) {
            mdBlock.remove()
            r.setStartAfter(mdBlockPreviousElement.lastElementChild)
            r.setEndAfter(mdBlockPreviousElement.lastElementChild)
            sel.setSingleRange(r)
            return true
        }

        //临近codemirror
        if (this.editor.domTool.isTextEmptyElement(mdBlock) && isMdBlockFence(mdBlockPreviousElement)) {
            mdBlock.remove()
            const editor = (this.editor as YaLiEditor)
            editor.ir.renderer.codemirrorManager.viewFocus(mdBlockPreviousElement.id)
            return true
        }

        if (this.editor.ir.rootElement.childElementCount == 1 && this.editor.domTool.isTextEmptyElement(mdBlock)) {
            return true
        }

        //尝试删除P节点
        if (this.editor.domTool.deleteTextEmptyElement(mdBlock)) {
            if (!mdBlockPreviousElement) {
                this.editor.ir.focueProcessor.updateFocusMdBlockByStart()
                return true
            }

            let text: any = this.editor.markdownTool.getParagraphLastTextNode(mdBlockPreviousElement as HTMLElement)
            if (text) {
                r.collapseAfter(text)
                sel.setSingleRange(r)
                return true
            }

            //选择下一个字符
            text = this.editor.markdownTool.getLastTextNode(mdBlockPreviousElement)
            if (text) {
                this.editor.domTool.selectedNodeLast(text)
                return true
            }
            return false
        }

        //模拟最后字符删除
        let startOff = r.startOffset
        //模拟最后字符删除(用于修复link的错误删除)
        if (start.nodeType == 3 && startOff == 1 && start.previousSibling && start.previousSibling.nodeType == 1) {
            let sib = start.previousSibling as HTMLElement
            if (isMdInlineLink(sib)) {
                r.setStart(start, startOff - 1)
                r.deleteContents()
                this.editor.ir.focueProcessor.focusMdInline(sib)
                return true
            } else if (isMdInlineFont(sib)) {
                r.setStart(start, startOff - 1)
                r.deleteContents()
                r.setStartAfter(sib.lastChild)
                r.setEndAfter(sib.lastChild)
                sel.setSingleRange(r)
                this.editor.ir.focueProcessor.focusMdInline(sib)
                return true
            }
        }

    }

    IRState.prototype.paragraphEnter = function (mdBlock) {

        if (IRfindClosestLi(mdBlock)) return false

        let sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        const p = createParagraph()
        if (r.startOffset === r.startContainer.textContent.length) {
            this.editor.domTool.insertElementAfterElement(mdBlock, p)
            sel.collapse(p, 0)
            return true
        } else if (r.startOffset === 0) {
            this.editor.domTool.insertElementBeforeElement(mdBlock, p)
            return true
        } else {
            let { start, end } = this.editor.domTool.splitElementAtCursor(mdBlock)
            end.setAttribute("mid", getUniqueKey() + "")
            this.editor.markdownTool.reRenderInlineElementAtBlock(start as HTMLElement)
            this.editor.markdownTool.reRenderInlineElementAtBlock(end as HTMLElement)
            sel.collapse(end, 0)
            return true
        }
    }

    IRState.prototype.paragraphInput = function (mdBlock: HTMLElement, mdInline, event) {
        if (event.data == " ") return false

        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0)
        const mark = r.getBookmark(mdBlock)
        const expectLength = mdBlock.textContent.length

        const block = this.paragraphRefresh(mdBlock, mdInline) as HTMLElement
        if (block) {
            (mark as any).containerNode = block
            //compute expectLength
            if (block.textContent.length != expectLength) {
                const bias = block.textContent.length - expectLength
                mark.end = mark.end + bias
                mark.start = mark.start + bias
            }
        }

        try {
            r.moveToBookmark(mark)
            sel.setSingleRange(r)

        } catch (err) {
            sel.collapse(mdBlock, mdBlock.childNodes.length)
        }
        this.editor.ir.focueProcessor.updateFocusElement()


        return block
    }

    IRState.prototype.paragraphRefresh = function (mdBlock: HTMLElement, mdInline) {
        if (!isMdBlockParagraph(mdBlock)) return false

        const editor = this.editor as YaLiEditor

        //尝试刷新行内的所有文本
        if (this.editor.markdownTool.reRenderInlineElementAtBlock(mdBlock)) {
            //this.editor.ir.focueProcessor.updateFocusElement()
            return mdBlock
        }

        //尝试对整个块进行转换
        mdBlock = this.editor.markdownTool.mdBlockTransform(mdBlock) as HTMLElement

        if (!mdBlock) return false

        if (isMdBlockMath(mdBlock)) {
            const container = mdBlock.querySelector(".markdown-it-code-beautiful")
            editor.ir.renderer.codemirrorManager.refreshStateCacheByElement(container)
            editor.ir.focueProcessor.updateFocusMdBlockByStart(mdBlock)
            setTimeout(() => {
                editor.ir.renderer.codemirrorManager.viewFocus(container.id)
            })
        }

        return mdBlock
    }
}

export default paragraphCtrl