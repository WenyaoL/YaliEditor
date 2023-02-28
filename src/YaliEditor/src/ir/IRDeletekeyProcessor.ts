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
import { isMdBlockFence, isMdBlockTable, isMdBlockParagraph, isMdBlockMath, isMdBlockHr, isMdBlockHTML, isMdInline, isMdInlineFont, isMdInlineLink, isMdBlockListItem, isMdInlineImg, isMdBlockMeta, isMdBlockCode, isMdBlockHeading, isMdInlineEmoji } from "../util/inspectElement";
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
        let mdInline = IRfindClosestMdInline(start)
        //尝试退化成P
        let p = this.editor.markdownTool.mdBlockDegenerateToP(mdBlock)
        if (p) {
            r.collapseToPoint(p, 0)
            sel.setSingleRange(r)
            this.editor.ir.focueProcessor.updateFocusElement()
            return true
        }
        
        //
        //退化失败后，mdBlock-Math和mdBlock-Fance将不做任何处理
        if (isMdInlineLink(mdInline) && this.editor.ir.state.linkDelete(mdBlock, mdInline)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdInlineImg(mdInline) && this.editor.ir.state.imgDelete(mdBlock, mdInline)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdInlineFont(mdInline) && this.editor.ir.state.fontDelete(mdBlock, mdInline)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdInlineEmoji(mdInline) && this.editor.ir.state.emojiDelete(mdBlock, mdInline)) {
            this.editor.ir.observer.flush()
            return true
        }

        
        if (isMdBlockParagraph(mdBlock) && this.editor.ir.state.paragraphDelete(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdBlockHeading(mdBlock) && this.editor.ir.state.headingDelete(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdBlockFence(mdBlock) && this.editor.ir.state.fenceDelete(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdBlockMath(mdBlock) && this.editor.ir.state.mathBlockDelete(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdBlockHTML(mdBlock) && this.editor.ir.state.htmlBlockDelete(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdBlockMeta(mdBlock) && this.editor.ir.state.metaBlockDelete(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdBlockCode(mdBlock) && this.editor.ir.state.codeBlockDelete(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
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
            this.editor.markdownTool.reRenderInlineElementAtBlock(startElement)
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

            
            if (this.deleteCollapsed()) {

                
                event.preventDefault()
            }
        } else {//范围删除
            if (this.deleteRang()) event.preventDefault()
        }
    }


    public execute(event: KeyboardEvent & { target: HTMLElement }) {
        if (event.key != "Backspace") return false
        if(event.target.tagName == "INPUT") return false
        
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