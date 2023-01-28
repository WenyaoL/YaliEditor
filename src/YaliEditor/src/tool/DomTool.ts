/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import YaliEditor from '../index'
import rangy from "rangy";
import { strToElement, strToDocumentFragment } from "../util/createElement"
import Reg from '../constant/reg'

class DomTool {
    public editor: YaliEditor;

    constructor(editor: YaliEditor) {
        this.editor = editor
    }

    /**
     * 在光标处插入text文本
     */
    insertTextNodeAtCursor(str: string) {
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0)
        const text = document.createTextNode(str)
        r.insertNode(text)
        r.collapseAfter(text)
        sel.setSingleRange(r)
        if (r.startContainer.nodeType == 1) {
            r.startContainer.normalize()
        } else if (r.startContainer.nodeType == 3) {
            r.startContainer.parentElement.normalize()
        }
    }

    /**
     * 在光标处插入element元素
     * @param element 
     */
    insertElementAtCursor(element: string | Element) {
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0)
        if (typeof element == "string") {
            element = strToElement(element)
        }
        r.insertNode(element)
        r.collapseAfter(element)
        sel.setSingleRange(r)
        element.parentElement.normalize()
    }


    /**
     * 在光标处插入element元素,字符串将会解析成HTML，允许多个element组成的字符串
     * @param str
     */
    insertAdjacentHTMLAtCursor(str: string) {
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0)
        const df = strToDocumentFragment(str)
        const last = df.lastChild
        r.insertNode(df)
        r.collapseAfter(last)
        sel.setSingleRange(r)
        last.parentElement.normalize()
    }

    insertElementBeforeElement(element: Element, insertElement: Element) {
        element.insertAdjacentElement("beforebegin", insertElement)
    }

    insertElementAfterElement(element: Element, insertElement: Element) {
        element.insertAdjacentElement("afterend", insertElement)
    }

    /**
     * 在光标处分开元素，并以`insertNode`进行分割
     * @param boundary 边界
     * @param insertNode 插入的node
     * @returns 返回分割后的两个元素
     */
    splitElementAtCursor(boundary: Element, insertNode?: Node) {
        const sel = rangy.getSelection()

        let r = sel.getRangeAt(0).cloneRange()
        r.setStartBefore(boundary)
        const preContents = r.cloneContents()
        const preFirstElementChild = preContents.firstElementChild

        r = sel.getRangeAt(0).cloneRange()
        r.setEndAfter(boundary)
        const lastContents = r.cloneContents()
        const lastFirstElementChild = lastContents.firstElementChild

        const df = document.createDocumentFragment()
        df.appendChild(preContents)
        if (insertNode) df.appendChild(insertNode)
        df.appendChild(lastContents)

        boundary.replaceWith(df)

        return {
            start: preFirstElementChild,
            end: lastFirstElementChild
        }
    }

    /**
     * 销毁一个没有显示文本的元素
     * @param element 
     */
    deleteTextEmptyElement(element: HTMLElement) {
        if (element.innerText.length == 0 || Reg.emptyString.test(element.innerText)) {
            element.remove()
            return true
        }
        return false
    }


    isTextEmptyElement(element: HTMLElement) {
        if (element.innerText.length == 0 || Reg.emptyString.test(element.innerText)) return true
        return false
    }

    deleteSeletedTextNode() {
        let sel = rangy.getSelection()
        let r = sel.getRangeAt(0).cloneRange()
        let nodeList = sel.getRangeAt(0).getNodes([3], (node) => {
            if (Reg.emptyString.test(node.textContent)) return false
            return true
        })

        nodeList.forEach(node => {
            if (r.startContainer == node) {
                node.textContent = node.textContent.slice(0, r.startOffset)
                return
            }

            if (r.endContainer == node) {
                node.textContent = node.textContent.slice(r.endOffset)
                return
            }
            (node as Text).replaceWith(document.createTextNode(""))
        })
    }

    selectedNodeLast(node: Node) {
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0)
        if (node.nodeType == 3) {
            r.collapseToPoint(node, node.textContent.length)
            sel.setSingleRange(r)
        } else if (node.nodeType == 1) {
            r.collapseToPoint(node, node.childNodes.length)
            sel.setSingleRange(r)
        }
    }

}

export default DomTool