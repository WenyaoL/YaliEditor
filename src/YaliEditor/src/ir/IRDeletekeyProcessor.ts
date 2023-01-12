/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import YaliEditor from '../index'
import {
    findClosestByAttribute,
    findClosestByClassName,
    findClosestByTop,
    IRfindClosestMdBlock
} from '../util/findElement';
import CONSTANTS from "../constant/constants";
import rangy from "rangy";
import { isMdBlockFence, isMdBlockTable, isMdBlockParagraph} from "../util/inspectElement";
import { KeyProcessor } from './KeyProcessor'

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

        //参试退化
        let p = this.editor.markdownTool.mdBlockDegenerateToP(mdBlock)
        if (p) {
            r.collapseToPoint(p, 0)
            sel.setSingleRange(r)
            return true
        }

        const mdBlockPreviousElement = mdBlock.previousElementSibling
        if (isMdBlockParagraph(mdBlock) && this.editor.domTool.deleteTextEmptyElement(mdBlock)) {
            if(isMdBlockParagraph(mdBlockPreviousElement)) {
                let text = this.editor.markdownTool.getParagraphLastTextNode(mdBlockPreviousElement as HTMLElement)
                if (text) {
                    r.collapseAfter(text)
                    sel.setSingleRange(r)
                    return true
                }
                
            }

            //选择下一个字符
            let text = this.editor.markdownTool.getLastTextNode(mdBlockPreviousElement)
            if (text) {
                this.editor.domTool.selectedNodeLast(text)
                return true
            }

            return false
        }

        if (start.nodeType === 3) {
            start = start.parentElement;
        }
        let e = start as HTMLElement

        //无字符删除的情况
        /*if (e.textContent.length == 0 || e.innerText == "\n") {

            //删除的是表格
            if (e && e.tagName == "TD" || e.tagName == "TH") {
                if (e.previousElementSibling) {
                    let element = e.previousElementSibling
                    let coll = 0
                    if (element.textContent && element.textContent.length > 0) coll = 1
                    sel.collapse(e.previousElementSibling, coll)
                } else if (e.parentElement.previousElementSibling) {
                    let element = e.parentElement.previousElementSibling
                    let coll = 0
                    if (element.lastElementChild.textContent.length > 0) coll = 1
                    sel.collapse(element.lastElementChild, coll)
                }
                //event.preventDefault()
                return
            }

            //删除的是列表
            if (e.parentElement && e.parentElement.tagName == "LI") {
                let li = e.parentElement
                let ol = li.parentElement
                li.remove()
                if (ol.childElementCount == 0) ol.remove()
                event.preventDefault()
                return
            }

            //删除发生在代码块旁边
            if (e.previousElementSibling && e.previousElementSibling.tagName == "PRE") {
                let sibling = e.previousElementSibling
                e.remove()
                let info = this.editor.ir.renderer.codemirrorManager.getViewInfo(sibling.id)
                let { node, offset } = info.view.domAtPos(info.view.state.doc.length)

                sel.collapse(node, offset)
                event.preventDefault()
                return
            }

            //删除发生在公式块旁边
            if (e.previousElementSibling && e.previousElementSibling.classList.contains("markdown-it-mathjax-beautiful")) {
                let sibling = e.previousElementSibling.getElementsByClassName("md-mathblock-input")[0]
                e.remove()
                let info = this.editor.ir.renderer.codemirrorManager.getViewInfo(sibling.id)
                let { node, offset } = info.view.domAtPos(info.view.state.doc.length)

                sel.collapse(node, offset)
                this.editor.ir.focueProcessor.updateFocusElement()
                event.preventDefault()
                return
            }

            //选择下一个字符
            let text = this.editor.markdownTool.getLastTextNode(mdBlock.previousElementSibling)

            if (text && !isMdBlockFence(mdBlock)) {
                r.collapseToPoint(text, text.textContent.length)
                sel.setSingleRange(r)
                e.remove()
                event.preventDefault()
                return
            }

            return
        }*/



        //删除元数据类
        if (e.classList.contains(CONSTANTS.CLASS_MD_META)) {
            //元数据类更改，应该影响内容的展示和标签的实际功能
            return false;
        }

        //删除隐藏类
        if (e.classList.contains(CONSTANTS.CLASS_MD_HIDEN)) {
            //寻找行级模块
            e = findClosestByAttribute(e, CONSTANTS.ATTR_MD_INLINE, "", this.editor.ir.getRootElementClassName())
            if (!e) return false
            if (e.hasAttribute(CONSTANTS.ATTR_MD_INLINE)) {
                r.selectNodeContents(e)
                rangy.getSelection().setSingleRange(r)
                return true;
            }
        }


        //校正删除LINK
        start = r.startContainer
        let startOff = r.startOffset
        //模拟字符删除
        if (startOff == 1 && start.previousSibling && start.previousSibling.nodeType == 1 && start.nodeType == 3) {
            let sib = start.previousSibling as HTMLElement
            if (sib.getAttribute(CONSTANTS.ATTR_MD_INLINE) == CONSTANTS.ATTR_MD_INLINE_LINK) {
                r.setStart(start, startOff - 1)
                r.deleteContents()
                return true
            }
        }

        return false;
    }

    deleteRang() {
        const r = rangy.getSelection().getRangeAt(0).cloneRange() as RangyRange
        let start = r.startContainer
        let end = r.endContainer

        if (this.editor.ir.focueProcessor.getSelectedBlockMdType() == CONSTANTS.ATTR_MD_BLOCK_FENCE) { 
            return false
        }
        //删除一个节点的
        if (r.getNodes().length == 1) {
            r.deleteContents()
        }

        //删除多个节点的
        if (r.getNodes().length > 1) {
            let startElement = IRfindClosestMdBlock(start)
            let endElement = IRfindClosestMdBlock(end)

            //相同的情况
            if (startElement === endElement) {
                if(isMdBlockTable(startElement)){
                    this.editor.domTool.deleteSeletedTextNode()
                    return true
                }
                //删除内容
                r.deleteContents()
                let mark = r.getBookmark(this.editor.ir.rootElement)
                this.editor.markdownTool.reRenderNode(startElement)
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
        return false;
    }

    filter(target: HTMLElement) {
        if (target.className == "el-input__inner") return true
    }


    /**
     * 删除键处理
     * @param event 
     */
    deleteKey(event: KeyboardEvent & { target: HTMLElement }) {

        if (this.filter(event.target)) return

        //单一的删除
        if (rangy.getSelection().isCollapsed) {
            if(this.deleteCollapsed()) event.preventDefault()
        } else {//范围删除
            if(this.deleteRang()) event.preventDefault()
        }
    }


    public execute(event: KeyboardEvent & { target: HTMLElement }) {
        if (event.key != "Backspace") return false

        //修改动作前的跟新
        this.editor.ir.focueProcessor.updateBeforeModify()
        try {
            this.deleteKey(event)
            this.editor.ir.observer.flush()
        } catch {
            event.preventDefault()
        }

        return true
    }

}


export default IRDeletekeyProcessor