import YaLiEditor from "..";
import { isMdBlockBulletList, isMdBlockCode, isMdBlockFence, isMdBlockHeading, isMdBlockHTML, isMdBlockMath, isMdBlockMeta, isMdBlockOrderList, isMdBlockParagraph, isMdBlockQuote, isMdBlockTable } from "../util/inspectElement";

import linkCtrl from "./linkCtrl";
import imgCtrl from "./imgCtrl";
import fontCtrl from "./fontCtrl";

import paragraphCtrl from './paragraphCtrl';
import headingCtrl from "./headingCtrl";
import metaBlockCtrl from "./metaBlockCtrl";
import mathBlockCtrl from "./mathBlockCtrl";
import fenceCtrl from "./fenceCtrl";
import htmlBlockCtrl from "./htmlBlockCtrl";
import codeBlockCtrl from "./codeBlockCtrl";
import listCtrl from "./listCtrl";
import quoteBlockCtrl from "./quoteBlockCtrl";
import emojiCtrl from "./emojiCtrl";


const ctrl=[
    linkCtrl,
    imgCtrl,
    fontCtrl,
    emojiCtrl,

    paragraphCtrl,
    headingCtrl,
    metaBlockCtrl,
    mathBlockCtrl,
    fenceCtrl,
    htmlBlockCtrl,
    codeBlockCtrl,

    listCtrl,
    quoteBlockCtrl,
]

class BaseState{
    [x: string]: any;

    linkDelete:any;
    imgDelete:any;
    fontDelete:any;

    paragraphDelete:any;
    headingDelete:any;
    metaBlockDelete:any;
    mathBlockDelete:any;
    fenceDelete:any;
    htmlBlockDelete:any;
    codeBlockDelete:any;

    linkInput:any;
    imgInput:any;
    fontInput:any;

    paragraphInput:any;
    headingInput:any;
    metaBlockInput:any;
    mathBlockInput:any;
    fenceInput:any;
    htmlBlockInput:any;
    codeBlockInput:any;

    paragraphEnter:any;
    headingEnter:any;
    metaBlockEnter:any;
    mathBlockEnter:any;
    fenceEnter:any;
    htmlBlockEnter:any;
    codeBlockEnter:any;
    
    listItmeEnter:any;
    quoteBlockEnter:any;

    imgRefresh:any;
    linkRefresh:any;
    fontRefresh:any;
}


/**
 * @author liangwenyao
 * @since 2023-2-10
 */
class IRState extends BaseState{
    

    public editor: YaLiEditor;
    
    constructor(editor: YaLiEditor) {
        super()
        this.editor = editor
    }

    diff(oldRoot: Element, newRoot: Element) {

        const oldList = Array.from(oldRoot.children)
        const newList = Array.from(newRoot.children)
        let oldIndex = 0;
        let newIndex = 0;
        while (oldIndex < oldList.length && newIndex < newList.length) {
            const oldElement = oldList[oldIndex]
            const newElement = newList[newIndex]

            if (!newElement) newIndex++;
            if (!oldElement) oldIndex++;
            if (!newElement || !oldElement) continue;

            const oldId = oldElement.getAttribute("mid")
            const newId = newElement.getAttribute("mid")
            if (oldId == newId && oldElement.tagName == newElement.tagName) {
                this.diffElement(oldElement, newElement)
                oldIndex++;
                newIndex++;
            } else {
                const index = this.findMidIndex(oldId, newList, newIndex)
                if (index >= 0) {
                    const df = this.toMidDocumentFragment(newList, newIndex, index)
                    const list = df.querySelectorAll(".markdown-it-code-beautiful")
                    list.forEach(e => this.editor.ir.renderer.codemirrorManager.unsafeRefreshEditorViewElementSyn(e))
                    this.editor.ir.renderer.codemirrorManager.refreshAllStateCache(list)
                    oldRoot.insertBefore(df, oldElement)
                } else {
                    this.deleteMidElement(oldElement)
                    oldList[oldIndex] = null
                    oldIndex++;
                }
            }
        }

        while (oldIndex < oldList.length) {
            const oldElement = oldList[oldIndex]
            if (oldElement) this.deleteMidElement(oldElement)
            oldIndex++;
        }

        if (newIndex < newList.length) {
            const df = this.toMidDocumentFragment(newList, newIndex, newList.length)
            const list = df.querySelectorAll(".markdown-it-code-beautiful")
            list.forEach(e => this.editor.ir.renderer.codemirrorManager.unsafeRefreshEditorViewElementSyn(e))
            this.editor.ir.renderer.codemirrorManager.refreshAllStateCache(list)
            oldRoot.appendChild(df)
        }

    }

    findMidIndex(mid: string, list: Array<Element>, fromIndex: number) {
        if (!list || fromIndex >= list.length) return -1;
        for (let i = fromIndex; i < list.length; i++) {
            const element = list[i]
            if (element.getAttribute("mid") == mid) return i
        }
        return -1;
    }

    toMidDocumentFragment(list: Array<Element>, fromIndex: number, toIndex: number) {
        const df = document.createDocumentFragment()
        for (let i = fromIndex; i < toIndex; i++) {
            df.appendChild(list[i])
            list[i] = null
        }
        return df
    }

    deleteMidElement(element: Element) {
        if (!element) return
        element.remove()
        if (isMdBlockFence(element)) {
            const uuid = element.id
            this.editor.ir.renderer.codemirrorManager.viewDestroy(uuid)
        } else if (isMdBlockMath(element) || isMdBlockHTML(element)) {
            const uuid = element.querySelector(".markdown-it-code-beautiful").id
            this.editor.ir.renderer.codemirrorManager.viewDestroy(uuid)
        }
    }

    diffElement(oldElement: Element, newElement: Element) {
        if (isMdBlockParagraph(oldElement)) this.diffParagraph(oldElement, newElement);
        else if (isMdBlockHeading(oldElement)) this.diffHeading(oldElement, newElement)
        else if (isMdBlockFence(oldElement)) this.diffCodeMirror(oldElement, newElement)
        else if (isMdBlockMath(oldElement)) this.diffMathBlock(oldElement, newElement)
        else if (isMdBlockHTML(oldElement)) this.diffHTMLBlock(oldElement, newElement)
        else if (isMdBlockBulletList(oldElement) || isMdBlockOrderList(oldElement)) this.diffList(oldElement,newElement)
        else if (isMdBlockCode(oldElement)) this.diffCodeBlock(oldElement,newElement)
        else if (isMdBlockQuote(oldElement)) this.diffBlockquote(oldElement,newElement)
        else if (isMdBlockTable(oldElement)) this.diffTable(oldElement,newElement)
        else oldElement.replaceWith(newElement)

    }


    diffParagraph(oldElement: Element, newElement: Element) {
        if (oldElement.textContent != newElement.textContent) oldElement.replaceWith(newElement)
    }

    diffHeading(oldElement: Element, newElement: Element) {
        if (oldElement.textContent != newElement.textContent) oldElement.replaceWith(newElement)
    }

    diffCodeMirror(oldElement: Element, newElement: Element) {
        const currId = oldElement.id
        const oldText = this.editor.ir.renderer.codemirrorManager.getTextValue(currId)
        if (oldText.length != newElement.textContent.length || oldText != newElement.textContent) {
            this.editor.ir.renderer.codemirrorManager.setTextValue(currId, newElement.textContent)
        }
    }

    diffMathBlock(oldElement: Element, newElement: Element) {
        const currId = oldElement.querySelector(".markdown-it-code-beautiful").id
        const oldText = this.editor.ir.renderer.codemirrorManager.getTextValue(currId)
        const newText = newElement.querySelector(".markdown-it-code-beautiful").textContent
        if (oldText.length != newText.length || oldText != newText) {
            this.editor.ir.renderer.codemirrorManager.setTextValue(currId, newText)
        }
    }

    diffHTMLBlock(oldElement: Element, newElement: Element) {
        const currId = oldElement.querySelector(".markdown-it-code-beautiful").id
        const oldText = this.editor.ir.renderer.codemirrorManager.getTextValue(currId)
        const newText = newElement.querySelector(".markdown-it-code-beautiful").textContent
        if (oldText.length != newText.length || oldText != newText) {
            this.editor.ir.renderer.codemirrorManager.setTextValue(currId, newText)
        }
    }

    diffList(oldElement:Element,newElement:Element){
        oldElement.replaceWith(newElement)
    }

    diffCodeBlock(oldElement:Element,newElement:Element){
        if (oldElement.textContent != newElement.textContent) oldElement.replaceWith(newElement)
    }

    diffBlockquote(oldElement:Element,newElement:Element){
        this.diff(oldElement,newElement)
    }

    diffTable(oldElement:Element,newElement:Element){
        oldElement.replaceWith(newElement)
    }


}   

for (let index = 0; index < ctrl.length; index++) {
    ctrl[index](IRState);
}



export default IRState;