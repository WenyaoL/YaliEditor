import YaLiEditor from "..";
import { isMdBlockBulletList, isMdBlockCode, isMdBlockFence, isMdBlockHeading, isMdBlockHTML, isMdBlockMath, isMdBlockOrderList, isMdBlockParagraph, isMdBlockQuote } from "../util/inspectElement";

/**
 * @author liangwenyao
 * @since 2023-2-10
 */
class IRState {

    public editor: YaLiEditor;

    constructor(editor: YaLiEditor) {
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
                    this.editor.ir.renderer.codemirrorManager.refreshStateCache(list)
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
            this.editor.ir.renderer.codemirrorManager.refreshStateCache(list)
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

}


export default IRState;