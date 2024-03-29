/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import IR from '.';
import YaliEditor from '../index'
import Constants from '../constant/constants';
import { getAllHeading, isMdBlockCode, isMdBlockFence, isMdBlockMath, isMdBlockMeta, isMdBlockParagraph, isMdBorder, isMdInlineImg, isMdInlineLink } from "../util/inspectElement";
import { strToElement, createParagraph } from "../util/createElement";
import { toTocElementText } from "../util/formatText"
import rangy from 'rangy';
class IRContextRefresher {

    public editor: YaliEditor;
    public ir: IR

    constructor(editor: YaliEditor) {
        this.editor = editor
        this.ir = this.editor.ir
    }

    subscribe() {
        //订阅
        this.ir.applicationEventPublisher.subscribe("refreshToc", () => {
            this.refreshToc()
        })

        this.ir.applicationEventPublisher.subscribe(Constants.IR_EVENT_CODEBLOCKINPUT, () => {
            this.editor.ir.observer.flush()
        })
    }


    /**
     * 刷新
     */
    refresh() {

        //强制让IR面板最后留一个空行
        if (this.editor.ir.rootElement.childElementCount==0 || this.editor.ir.rootElement.lastElementChild.tagName != "P") {
            this.editor.ir.rootElement.appendChild(createParagraph())
        }

        //补丁类的刷新

        this.refreshContext()
        //this.refreshToc()

        //更新焦点元素
        this.editor.ir.focueProcessor.updateFocusElement()
        this.editor.ir.focueProcessor.updateBookmark()
    }

    refreshContext() {
        this.refreshTable()
        this.refreshToc()
    }


    /**
     * 刷新聚焦的行,参数escape用于阻止整个P标签的内部重新渲染,但不阻止Mdinline级别的渲染
     * @param escape 
     * @returns 
     */
    refreshFocusInline() {
        //根据行类型选择是否强制刷新块
        let { block, inline } = this.editor.ir.focueProcessor.getSelectedMdElement(false)
        const likeType = this.editor.ir.focueProcessor.getSelectedInlineBeLikeType()

        if (!block) return false

        //只有P标签才进行刷新
        if (isMdBlockParagraph(block)) {
            const sel = rangy.getSelection()

            if (this.editor.ir.state.imgRefresh(block, inline)) return true
            if (this.editor.ir.state.linkRefresh(block, inline)) return true

            //尝试刷新行内的所有文本
            let mark = sel.getBookmark(block)
            if (this.editor.markdownTool.reRenderInlineElementAtBlock(block)) {
                sel.moveToBookmark(mark)
                this.editor.ir.focueProcessor.updateFocusElement()
                return true
            }
            return false
        }

        return false
    }

    /**
     * 刷新聚焦的块级元素，只有在标签发生转变时才对变化进行渲染
     * 如：
     * p  --重新翻译为markdown再重新转化为HTML--> p (该变化将不会被渲染到页面，除非使用强制刷新)
     * p  ---->  h2  (节点发生变化，渲染到页面)
     * @returns 
     */
    refreshFocusBlock(force?: boolean) {
        let sel = rangy.getSelection()
        //获取当前所在的块
        let block = this.editor.ir.focueProcessor.getSelectedBlockMdElement()
        if (!block || isMdBlockFence(block) || isMdBlockMath(block) || isMdBlockMeta(block) || isMdBlockCode(block)) return
        let bookmark = sel.getBookmark(block)
        //强制刷新
        if (force) {
            let turndown = this.editor.markdownTool.turndown(block)
            const res = this.editor.markdownTool.renderBlock(turndown)
            const e = strToElement(res)
            block.replaceWith(e)
            bookmark.rangeBookmarks[0].containerNode = e
            sel.moveToBookmark(bookmark)
            this.editor.ir.focueProcessor.updateFocusElement()
            return
        }
        block = this.editor.markdownTool.mdBlockTransform(block) as HTMLElement
        if (!block) return
        sel.collapse(block, block.childNodes.length)
        this.editor.ir.focueProcessor.updateFocusElement()
    }

    /**
     * 刷新图片节点
     */
    refreshImg(block: HTMLElement, inline: HTMLElement) {
        if (!isMdInlineImg(inline)) return false;

        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0)
        const parent = r.startContainer.parentElement

        if (isMdBorder(parent)) {
            let mark = sel.getBookmark(block)
            inline = this.editor.markdownTool.reRenderInlineElement(inline) as HTMLElement
            if (!inline) return false
            block.normalize()
            mark.rangeBookmarks[0].containerNode = block
            sel.moveToBookmark(mark)
            this.editor.ir.focueProcessor.updateFocusElement()
            return true
        } else if (parent.classList.contains("md-info") && parent.nextElementSibling.textContent == "](") { //修改的是描述信息（并且检测后面的边框完整性）
            inline.querySelector("img").alt = parent.textContent
            this.editor.ir.focueProcessor.updateFocusElement()
            return true
        } else if (parent.classList.contains("md-img-url") && parent.nextElementSibling) { //修改的是链接（并且检测后面的边框完整性）
            inline.querySelector("img").src = parent.textContent
            this.editor.ir.focueProcessor.updateFocusElement()
            return true
        }
        return false
    }

    /**
     * 刷新上下文中链接节点
     */
    refreshLink(block: HTMLElement, inline: HTMLElement) {
        if (!isMdInlineLink(inline)) return false;

        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0)
        const parent = r.startContainer.parentElement

        if (isMdBorder(parent)) {
            let mark = sel.getBookmark(block)
            inline = this.editor.markdownTool.reRenderInlineElement(inline) as HTMLElement
            if (!inline) return false
            block.normalize()
            mark.rangeBookmarks[0].containerNode = block
            sel.moveToBookmark(mark)
            this.editor.ir.focueProcessor.updateFocusElement()
            return true
        } else if (parent.classList.contains("md-link-url") && parent.nextElementSibling) { //修改的是链接（并且检测后面的边框完整性）
            inline.querySelector("a").href = encodeURI(parent.textContent)
            this.editor.ir.focueProcessor.updateFocusElement()
            return true
        }
        return false
    }


    /**
     * 刷新table（补丁）
     */
    refreshTable() {
        let root = this.ir.rootElement

        let tds = root.getElementsByTagName("td")
        for (let index = 0; index < tds.length; index++) {
            const element = tds[index];
            if (element.innerText == "\n") {
                element.innerText = "";
            }
        }

        let ths = root.getElementsByTagName("th")
        for (let index = 0; index < ths.length; index++) {
            const element = ths[index];
            if (element.innerText == "\n") {
                element.innerText = "";
            }
        }
    }








    /**
     * 刷新上下文中的TOC节点
     */
    refreshToc() {
        let root = this.ir.rootElement
        let toc = root.querySelector(".markdown-it-toc-beautiful[md-block]")
        let headings = getAllHeading(root)
        if (!toc) {
            this.ir.applicationEventPublisher.publish("refreshedToc", headings)
            return
        }
        let headText = toTocElementText(headings)
        let p = toc.getElementsByTagName("p")[0]
        p.innerHTML = headText

        this.ir.applicationEventPublisher.publish("refreshedToc", headings)
    }
}

export default IRContextRefresher