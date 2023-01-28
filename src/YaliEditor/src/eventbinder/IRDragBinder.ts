/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import YaLiEditor from "..";
import { BaseEventBinder } from "../../types";
import { strToElement } from '../util/createElement'
import rangy from "rangy";

class IRDragBinder implements BaseEventBinder {
    editor: YaLiEditor;

    constructor(editor: YaLiEditor) {
        this.editor = editor

    }

    dropImg(ev: DragEvent) {
        let img: File & { path: string } = ev.dataTransfer?.files.item(0) as File & { path: string }

        if (!img.path) return

        let render = this.editor.ir.renderer.render("![](" + img.path + ")")

        let e = strToElement(render)
        if (!e) return false
        let sel = rangy.getSelection()
        let r = sel.getRangeAt(0).cloneRange()
        r.insertNode(e)
        this.editor.ir.observer.forceFlush()
        return true
    }

    bindDrog(element: HTMLElement) {
        element.addEventListener("drop", (ev) => {
            ev.preventDefault()

            if (this.dropImg(ev)) return

        })
    }


    bindEvent(element: HTMLElement): void {
        this.bindDrog(element)
    }

}

export default IRDragBinder