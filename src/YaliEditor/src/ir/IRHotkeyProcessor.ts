/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import YaLiEditor from '..'
import {
    findClosestByAttribute,
    findClosestByTop,
    IRfindClosestMdBlock,
    IRfindClosestParagraph,
    IRfindClosestLi,
    IRfindClosestList,
    IRfindClosestMdInline
} from "../util/findElement";

import { getAllHeading, isMdBlockFence, isMdBlockHeading, isMdBlockHTML, isMdBlockMath, isMdBlockParagraph } from '../util/inspectElement';
import { createBlockquote, createMdList, strToDocumentFragment, strToElement } from '../util/createElement';
import Constants from "../constant/constants";
import { toKeyText, createTableStr, toTocElementText } from "../util/formatText"
import rangy from "rangy";
import { createParagraph } from '../util/createElement'
import { KeyProcessor } from './KeyProcessor';
import { defaultKeyMap } from '../config/IRConfig'





class IRHotkeyProcessor implements KeyProcessor {
    //编辑器
    public editor: YaLiEditor;

    //命令映射
    private defaultCommandMap: Map<string, Function> = new Map([
        ["edit.undo", this.undoKey],
        ["edit.redo", this.redoKey],

        ["paragraph.heading-1", this.headingKey],
        ["paragraph.heading-2", this.headingKey],
        ["paragraph.heading-3", this.headingKey],
        ["paragraph.heading-4", this.headingKey],
        ["paragraph.heading-5", this.headingKey],
        ["paragraph.heading-6", this.headingKey],

        ["paragraph.reduceIndent-list", this.reduceIndentKey],
        ["paragraph.addIndent-list,", this.addIndentKey],
        ["paragraph.code-fence", this.codeblockKey],
        ["paragraph.quote-block", this.quoteKey],
        ["paragraph.order-list", this.listKey],
        ["paragraph.bullet-list", this.unlistKey],
        ["paragraph.toc", this.tocKey],
        ["paragraph.html-block", this.htmlblockKey],
        ["paragraph.math-block", this.mathKey],

        ["format.inline-code", this.codelineKey],
        ["format.deleteline", this.deletelineKey],
        ["format.strong", this.blodKey],
        ["format.italic", this.italicKey],
        ["format.underline", this.underlineKey],
    ])

    constructor(editor: YaLiEditor) {
        this.editor = editor
    }

    /**
     * 撤销操作
     * @param event 
     */
    undoKey(event: KeyboardEvent) {
        const r = rangy.getSelection().getRangeAt(0)
        let start: HTMLElement | Node | null = r.startContainer
        if (start.nodeType === 3) {
            start = start.parentElement;
        }
        this.editor.ir.undo()
    }

    redoKey(event: KeyboardEvent) {
        this.editor.ir.redo()
    }



    /**
     * 标题快捷键
     * @param event 
     */
    headingKey(event: KeyboardEvent, command?: string) {
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0)
        const start = r.startContainer
        const level = command.charAt(command.length - 1)

        let mdBlock = IRfindClosestMdBlock(start)

        if (!mdBlock) return

        const currLevel = mdBlock.tagName.charAt(mdBlock.tagName.length - 1)
        //当前标签是否和命令转换标签相同，相同:转化成P标签，不同:则转化
        if (currLevel == level) {
            mdBlock = this.editor.markdownTool.mdBlockTransformToParagraph(mdBlock) 
        } else {
            mdBlock = this.editor.markdownTool.mdBlockTransformToHeanding(mdBlock, parseInt(level)) as HTMLElement
        }
        sel.collapse(mdBlock)
        this.editor.ir.applicationEventPublisher.publish("refreshToc")
        this.editor.ir.focueProcessor.updateFocusElement()
        this.editor.ir.observer.forceFlush()
    }

    /**
     * 代码块快捷键
     */
    codeblockKey(event: KeyboardEvent | null) {
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange

        let uuid: string = '',
            extractContents: string;

        //获取当前块
        let mdBlock = IRfindClosestMdBlock(sel.getRangeAt(0).startContainer)
        if (!mdBlock) return

        if (isMdBlockFence(mdBlock)) return

        //提取文本
        if (!sel.isCollapsed) {
            extractContents = this.editor.domTool.getTextContentAtSelected()
        }

        if (!extractContents) extractContents = ''

        //创建代码块
        const codeStr = "```\n" + extractContents + "\n```"
        const res = this.editor.ir.renderer.render(codeStr)
        const codeBlock = strToElement(res)

        //获取uuid
        uuid = codeBlock.id

        if (this.editor.markdownTool.replaceMdBlockFence(mdBlock, codeBlock)) { }
        else {
            //插入代码块
            const { start, end } = this.editor.domTool.splitElementAtCursor(mdBlock, codeBlock, true)

            //刷新start和end节点
            if (isMdBlockParagraph(start)) this.editor.markdownTool.reRenderInlineElementAtBlock(start as HTMLElement)
            if (isMdBlockParagraph(end)) this.editor.markdownTool.reRenderInlineElementAtBlock(end as HTMLElement)
        }


        this.editor.ir.renderer.refreshStateCache(this.editor.ir.rootElement)

        //锁定为聚焦元素
        this.editor.ir.focueProcessor.setFocusElementByMdblock(codeBlock as HTMLElement)
        this.editor.ir.renderer.codemirrorManager.viewFocus(uuid)
        this.editor.ir.renderer.codemirrorManager.mountInputComponent(uuid)

        this.editor.ir.observer.forceFlush()
    }

    htmlblockKey(event: KeyboardEvent | null) {
        const sel = rangy.getSelection()

        let uuid: string = '',
            extractContents: string;

        //获取当前块
        let mdBlock = IRfindClosestMdBlock(sel.getRangeAt(0).startContainer)
        if (!mdBlock) return

        if (isMdBlockHTML(mdBlock)) return

        //提取文本
        if (!sel.isCollapsed) {
            extractContents = this.editor.domTool.getTextContentAtSelected()
        }

        if (!extractContents) extractContents = ''

        //创建代码块
        const htmlStr = "<div>" + extractContents + "</div>"
        const res = this.editor.ir.renderer.render(htmlStr)
        const htmlBlock = strToElement(res)

        //获取uuid
        uuid = htmlBlock.querySelector(".markdown-it-code-beautiful").id

        if (this.editor.markdownTool.replaceMdBlockFence(mdBlock, htmlBlock)) { }
        else {
            //插入代码块
            const { start, end } = this.editor.domTool.splitElementAtCursor(mdBlock, htmlBlock, true)

            //刷新start和end节点
            if (isMdBlockParagraph(start)) this.editor.markdownTool.reRenderInlineElementAtBlock(start as HTMLElement)
            if (isMdBlockParagraph(end)) this.editor.markdownTool.reRenderInlineElementAtBlock(end as HTMLElement)
        }


        this.editor.ir.renderer.refreshStateCache(this.editor.ir.rootElement)

        //锁定为聚焦元素
        this.editor.ir.focueProcessor.setFocusElementByMdblock(htmlBlock as HTMLElement)
        this.editor.ir.renderer.codemirrorManager.viewFocus(uuid)

        event?.preventDefault()
        this.editor.ir.observer.forceFlush()
    }

    /**
     * 标题生成 markdown-it-toc-beautiful
     * @param event 
     */
    tocKey(event: KeyboardEvent | null) {


        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        const start = r.startContainer

        const top = findClosestByTop(start, this.editor.ir.getRootElementClassName())
        if (!top) return
        r.collapseBefore(top)
        const root = this.editor.ir.rootElement

        //构建toc
        let res: string[] = []
        let svg = '<i class="el-icon-delete"></i>'
        let tip = '<div class="md-toc-tip md-hiden">' + '<span>目录</span><button class="toc-delete" onclick="TOC_DELETE()"><span>' + svg + '</button></span></div>';
        res.push(tip)

        res.push("<p>")
        const headings = getAllHeading(root)
        res.push(toTocElementText(headings))

        /*for (let index = 0; index < headings.length; index++) {
            const element = headings[index];
            let head = '<span class="md-toc-h'+ element.level +' md-toc-item ">' + '<a to-href="'+element.id+'">'+ element.content+'</a></span>'
            res.push(head)
        }*/
        res.push("</p>")

        let div = document.createElement("div")
        div.innerHTML = res.join("")
        div.className = "markdown-it-toc-beautiful"
        div.setAttribute(Constants.ATTR_MD_BLOCK, Constants.ATTR_MD_BLOCK_TOC)
        div.contentEditable = "false"

        r.insertNode(div)
        this.editor.ir.observer.forceFlush()
    }

    /**
     * 小代码块快捷键
     * @param event 
     */
    codelineKey(event: KeyboardEvent | null) {
        this.typefaceKey(event, "`", "`", Constants.ATTR_MD_INLINE_CODE)
    }

    /**
     * 
     * @param event 
     */
    deletelineKey(event: KeyboardEvent | null) {
        this.typefaceKey(event, "~~", "~~", Constants.ATTR_MD_INLINE_DELETELINE)
    }

    blodKey(event: KeyboardEvent | null) {
        this.typefaceKey(event, "**", "**", Constants.ATTR_MD_INLINE_STRONG)

    }

    underlineKey(event: KeyboardEvent | null) {
        this.typefaceKey(event, '<u>', '</u>', Constants.ATTR_MD_INLINE_UNDERLINE)
    }

    italicKey(event: KeyboardEvent | null) {
        this.typefaceKey(event, "*", "*", Constants.ATTR_MD_INLINE_EM)
    }

    /**
     * 字体渲染，可渲染各种字体等
     * @param event 
     * @param pre 
     * @param suf 
     * @returns 
     */
    typefaceKey(event: KeyboardEvent | null, pre: string, suf: string, type?: string) {
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        const start = r.startContainer
        const end = r.endContainer
        let e = IRfindClosestMdBlock(start)
        if (!e) return
        let content: DocumentFragment;

        //撤销原有字体
        let inline = IRfindClosestMdInline(start)
        if (start == end && inline != null) {
            let text = inline.textContent
            if (type == inline.getAttribute(Constants.ATTR_MD_INLINE)) {
                inline.replaceWith(text)
                return
            }
            /*let previousSibling = inline.previousSibling
            let nextSibling = inline.nextSibling
            if(previousSibling && nextSibling && previousSibling.nodeType==3 && nextSibling.nodeType==3){
            }*/
        }

        if (!r.collapsed) {
            content = r.extractContents()
            let str = content.textContent
            str = pre + str + suf
            const res = this.editor.markdownTool.renderInline(str)  
            
            const inline = this.editor.domTool.insertAdjacentHTMLAtCursor(res)
            r.selectNodeContents(inline)
            sel.setSingleRange(r)
            
            this.editor.ir.focueProcessor.updateFocusElement()
        }
        this.editor.ir.observer.forceFlush()
    }

    /**
     * 数学公式渲染
     * @param event 
     */
    mathKey(event: KeyboardEvent) {
        const sel = rangy.getSelection()

        let uuid: string = '',
            extractContents: string = '';

        //获取当前块
        let mdBlock = IRfindClosestMdBlock(sel.getRangeAt(0).startContainer)
        if (!mdBlock) return

        if (isMdBlockMath(mdBlock)) return

        //提取文本
        if (!sel.isCollapsed) {
            extractContents = this.editor.domTool.getTextContentAtSelected()
        }
        if (!extractContents) extractContents = ''
        //创建数学块
        const codeStr = "$$\n" + extractContents + "\n$$"
        const res = this.editor.ir.renderer.render(codeStr)
        const mathBlock = strToElement(res)

        //获取uuid
        const codemirrorBlock = mathBlock.querySelector(".markdown-it-code-beautiful")
        uuid = codemirrorBlock ? codemirrorBlock.id : ''

        if (this.editor.markdownTool.replaceMdBlockFence(mdBlock, mathBlock)) { }
        else {
            //插入代码块
            const { start, end } = this.editor.domTool.splitElementAtCursor(mdBlock, mathBlock, true)

            //刷新start和end节点
            if (isMdBlockParagraph(start)) this.editor.markdownTool.reRenderInlineElementAtBlock(start as HTMLElement)
            if (isMdBlockParagraph(end)) this.editor.markdownTool.reRenderInlineElementAtBlock(end as HTMLElement)
        }


        this.editor.ir.renderer.refreshStateCache(this.editor.ir.rootElement)

        //锁定为聚焦元素
        this.editor.ir.focueProcessor.setFocusElementByMdblock(mathBlock as HTMLElement)

        this.editor.ir.renderer.codemirrorManager.viewFocus(uuid)

        this.editor.ir.observer.forceFlush()
    }


    /**
     * 添加缩进
     * @param event 
     */
    addIndentKey(event: KeyboardEvent) {
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        const start = r.startContainer

        let li = IRfindClosestLi(start)
        if (!li) return
        let list = IRfindClosestList(li)
        //是否有前兄弟节点
        if (li.previousElementSibling) {
            let sibling = li.previousElementSibling
            let siblingChild: HTMLElement | null = sibling.getElementsByTagName("ol").item(0)
            if (!siblingChild) siblingChild = sibling.getElementsByTagName("ul").item(0)

            //根据兄弟节点是否有儿子进行决策
            if (!siblingChild) {//兄弟节点没有儿子列表
                //给兄弟节点创建儿子     
                siblingChild = createMdList(list.tagName.toLowerCase())
                sibling.appendChild(siblingChild)
            }

            //判断当前节点是否有儿子节点
            let liChild: HTMLElement | null = li.getElementsByTagName("ol").item(0)
            if (!liChild) liChild = li.getElementsByTagName("ul").item(0)

            const bookmark = sel.getBookmark(li)
            if (liChild) {//当前节点有儿子节点
                siblingChild.appendChild(li)
                const childrenArray = Array.from(liChild.children)
                for (let index = 0; index < childrenArray.length; index++) {
                    const element = childrenArray.at(index)
                    siblingChild.appendChild(element)
                }
                liChild.remove()
                sel.moveToBookmark(bookmark)
            } else {//当前节点没有儿子节点
                siblingChild.appendChild(li)
                sel.moveToBookmark(bookmark)
            }

        }
        this.editor.ir.observer.forceFlush()
    }

    /**
     * 减少缩进
     * @param event 
     */
    reduceIndentKey(event: KeyboardEvent) {
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        const start = r.startContainer

        let li = IRfindClosestLi(start)
        if (!li) return
        let list = IRfindClosestList(li)
        //是否有上级列表
        if (list?.parentElement?.tagName === "LI") {
            let parentLi = list.parentElement

            //判断是否有儿子节点
            let liChild: HTMLElement | null = li.getElementsByTagName("ol").item(0)
            if (!liChild) liChild = li.getElementsByTagName("ul").item(0)
            //没有儿子并且有下兄弟节点
            if (!liChild && li.nextElementSibling) {
                //创建儿子
                liChild = document.createElement(list.tagName.toLowerCase())
                li.appendChild(liChild)
            }

            //兄弟节点变儿子节点
            let sibling = li.nextElementSibling
            while (sibling) {
                liChild?.appendChild(sibling)
                sibling = li.nextElementSibling
            }
            let bookmark = sel.getBookmark(li)
            parentLi.insertAdjacentElement("afterend", li)

            if (list.children.length === 0) list.remove()
            sel.moveToBookmark(bookmark)
        }
        this.editor.ir.observer.forceFlush()
    }

    /**
     * 有序列表快捷键
     * @param event 
     */
    listKey(event: KeyboardEvent | null) {
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        const start = r.startContainer

        let p = IRfindClosestParagraph(start)
        if (!p) return
        //重新渲染该节点
        let turndown = this.editor.ir.parser.turndown(p)
        turndown = "1. " + turndown;

        let res = this.editor.ir.renderer.render(turndown)
        const div = document.createElement("div")
        div.innerHTML = res
        r.selectNode(p)
        r.deleteContents()

        r.insertNode(div.firstElementChild)

        this.editor.ir.observer.forceFlush()
    }

    /**
     * 无序列表快捷键
     * @param event 
     */
    unlistKey(event: KeyboardEvent | null) {
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        const start = r.startContainer
        const end = r.endContainer

        //判断是否已经是li
        IRfindClosestLi(start)


        let startP = IRfindClosestParagraph(start)
        let endP = IRfindClosestParagraph(end)

        r.setStartBefore(startP)
        r.setEndAfter(endP)

        let content = r.extractContents()

        let div = document.createElement("div")
        div.appendChild(content)

        //重新渲染该节点
        let turndown = this.editor.ir.parser.turndown(div.innerHTML)

        //切割行
        let split = turndown.split("\n")

        split = split.map(row => {
            if (row.length == 0) return row
            return "* " + row
        })

        turndown = split.join("\n")


        let res = this.editor.ir.renderer.render(turndown)
        div.innerHTML = res

        r.deleteContents()
        r.insertNode(div.firstElementChild)

        this.editor.ir.observer.forceFlush()
    }

    /**
     * 引用快捷键
     * @param event 
     */
    quoteKey(event: KeyboardEvent) {
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        const start = r.startContainer
        const end = r.endContainer

        //判断是否对li进行引用
        let li = IRfindClosestLi(start)
        if (li) {
            r.setStart(li, 0)
            r.setEndAfter(li.lastElementChild)
            let content = r.extractContents()

            const quote = createBlockquote()
            quote.appendChild(content)
            r.insertNode(quote)
            this.editor.ir.observer.forceFlush()
            return
        }

        let startE = IRfindClosestMdBlock(start)
        let endE = IRfindClosestMdBlock(end)


        r.setStartBefore(startE)
        r.setEndAfter(endE)
        let content = r.extractContents()

        const quote = createBlockquote()
        quote.appendChild(content)
        r.insertNode(quote)
        this.editor.ir.observer.forceFlush()
    }

    /**
     * 表格创建
     * @param row 
     * @param col 
     */
    tableCreate(row: number, col: number) {
        //先克隆再赋值，否则可能导致拿到的不是旧的范围
        const cloneRange = this.editor.ir.focueProcessor.sel.getRangeAt(0).cloneRange() as RangyRange
        rangy.getSelection().setSingleRange(cloneRange)

        this.editor.ir.deletekeyProcessor.deleteRang()

        const format = createTableStr(row, col)
        const domF = strToDocumentFragment(this.editor.ir.renderer.render(format))
        const thDom = domF.querySelector("th")

        const mdBlock = this.editor.ir.focueProcessor.getSelectedBlockMdElement()
        this.editor.domTool.splitElementAtCursor(mdBlock, domF, true)
        setTimeout(() => {
            this.editor.ir.focueProcessor.setCursor(thDom, 0)
            this.editor.ir.observer.forceFlush()
        })

    }

    getCommand(key: string) {
        if (!key) return
        key = key.toLowerCase()
        for (const [k, v] of this.editor.options.commonConfig.defaultKeyMap) {
            if (v && v.toLowerCase() == key) return k
        }
    }

    /**
     * 执行
     * @param event 
     */
    execute(event: KeyboardEvent) {
        const k = toKeyText(event)
        const command = this.getCommand(k)

        const f: Function = this.defaultCommandMap.get(command)
        if (f) {
            //修改动作前的跟新
            this.editor.ir.focueProcessor.updateBeforeModify()
            f.call(this, event, command)
            event.preventDefault()
            return true
        }


        return false
    }
}




export default IRHotkeyProcessor;