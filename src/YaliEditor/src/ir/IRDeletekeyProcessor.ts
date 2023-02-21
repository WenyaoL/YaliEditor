/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import YaliEditor from '../index'
import {
    IRfindClosestMdBlock,
    IRfindClosestMdInline
} from '../util/findElement';
import CONSTANTS from "../constant/constants";
import rangy from "rangy";
import { isMdBlockFence, isMdBlockTable, isMdBlockParagraph, isMdBlockMath, isMdBlockHr, isMdBlockHTML, isMdInline, isMdInlineFont, isMdInlineLink, isMdBlockListItem } from "../util/inspectElement";
import { KeyProcessor } from './KeyProcessor'
import { sortBy } from 'lodash';

class IRDeletekeyProcessor implements KeyProcessor {

    public editor: YaliEditor;

    constructor(editor: YaliEditor) {
        this.editor = editor
    }

    deleteCollapsed() {
        let sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        let start = r.startContainer


        let mdBlock = IRfindClosestMdBlock(start)

        //尝试退化成P
        let p = this.editor.markdownTool.mdBlockDegenerateToP(mdBlock)
        if (p) {
            r.collapseToPoint(p, 0)
            sel.setSingleRange(r)
            return true
        }

        //退化失败后，mdBlock-Math和mdBlock-Fance将不做任何处理
        if (!this.filter()) return false

        //P标签处理
        if (isMdBlockParagraph(mdBlock)) {
            const mdBlockPreviousElement = mdBlock.previousElementSibling
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
            }else if(isMdInlineFont(sib)){
                r.setStart(start, startOff - 1)
                r.deleteContents()
                r.setStartAfter(sib.lastChild)
                r.setEndAfter(sib.lastChild)
                sel.setSingleRange(r)
                this.editor.ir.focueProcessor.focusMdInline(sib)
                return true
            }
        }

        return false;
    }

    deleteRang() {
        const r = rangy.getSelection().getRangeAt(0).cloneRange() as RangyRange
        let start = r.startContainer
        let end = r.endContainer

        if (!this.filter()) {
            return false
        }
        let startElement = IRfindClosestMdBlock(start)
        let endElement = IRfindClosestMdBlock(end)
        //删除一个节点的
        if (r.getNodes().length == 1) {
            r.deleteContents()
            let startinline = IRfindClosestMdInline(start)
            this.editor.ir.contextRefresher.refreshImg(startElement, startinline)
            return true
        }

        //删除多个节点的
        if (r.getNodes().length > 1) {


            //相同的情况
            if (startElement === endElement) {
                if (isMdBlockTable(startElement)) {
                    this.editor.domTool.deleteSeletedTextNode()
                    return true
                }

                //删除内容
                r.deleteContents()

                let mark = r.getBookmark(this.editor.ir.rootElement)

                if (isMdBlockParagraph(startElement)) this.editor.markdownTool.reRenderInlineElementAtBlock(startElement)
                else this.editor.markdownTool.reRenderNode(startElement)

                r.moveToBookmark(mark)

                rangy.getSelection().setSingleRange(r)
            } else {
                //起始和结束容器不一样的情况
                //删除内容
                r.deleteContents()
                let mark = r.getBookmark(this.editor.ir.rootElement)
                this.editor.markdownTool.reRenderNode(startElement)
                this.editor.markdownTool.reRenderNode(endElement)
                r.moveToBookmark(mark)
                rangy.getSelection().setSingleRange(r)
                return true
            }
        }
        return true;
    }

    filter() {
        let mdBlock = this.editor.ir.focueProcessor.getSelectedBlockMdElement()
        if (isMdBlockFence(mdBlock) || isMdBlockMath(mdBlock) || isMdBlockHTML(mdBlock)) return false
        return true
    }


    /**
     * 删除键处理
     * @param event 
     */
    deleteKey(event: KeyboardEvent & { target: HTMLElement }) {


        //单一的删除
        if (rangy.getSelection().isCollapsed) {
            if (this.deleteCollapsed()) event.preventDefault()
        } else {//范围删除
            if (this.deleteRang()) event.preventDefault()
        }
    }


    public execute(event: KeyboardEvent & { target: HTMLElement }) {
        if (event.key != "Backspace") return false

        //修改动作前的跟新
        this.editor.ir.focueProcessor.updateBeforeModify()
        try {
            this.deleteKey(event)
            this.editor.ir.focueProcessor.updateFocusElement()
            this.editor.ir.observer.flush()
        } catch {
            event.preventDefault()
        }

        return true
    }

}

export default IRDeletekeyProcessor