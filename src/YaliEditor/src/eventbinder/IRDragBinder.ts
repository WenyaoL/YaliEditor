/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import YaLiEditor from "..";
import { BaseEventBinder } from "../../types";
import { strToElement } from '../util/createElement'
import rangy from "rangy";
import Reg from "../constant/reg";

class IRDragBinder implements BaseEventBinder {
    editor: YaLiEditor;

    constructor(editor: YaLiEditor) {
        this.editor = editor

    }

    

    bindDrog(element: HTMLElement) {
        element.addEventListener("drop", (ev) => {
            this.editor.ir.dragProcessor.execute(ev)
        })
    }


    bindEvent(element: HTMLElement): void {
        this.bindDrog(element)
    }

}

export default IRDragBinder