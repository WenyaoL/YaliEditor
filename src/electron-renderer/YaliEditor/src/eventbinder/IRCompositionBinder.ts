/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { BaseEventBinder } from "../../types";
import YaLiEditor from "..";

class IRCompositionBinder implements BaseEventBinder {
    public composingLock: boolean = false;

    public editor: YaLiEditor;
    constructor(editor: YaLiEditor) {
        this.editor = editor
    }
    public bindCompositionstartEvent(element: HTMLElement) {
        //输入前触发（打拼英时，触发顺序compositionstart compositionend）
        element.addEventListener("compositionstart", (event: CompositionEvent & { target: HTMLElement }) => {
            this.editor.ir.compositionProcessor.compositionStart(event)
        });

    }

    public bindCompositionendEvent(element: HTMLElement) {
        //输入后触发
        element.addEventListener("compositionend", (event: CompositionEvent & { target: HTMLElement }) => {
            this.editor.ir.compositionProcessor.compositionEnd(event)
        });
    }

    public bindCompositionupdateEvent(element:HTMLElement){
        element.addEventListener("compositionupdate", (event: CompositionEvent & { target: HTMLElement }) => {
            this.editor.ir.compositionProcessor.compositionUpdate(event)
        });
    }

    public bindEvent(element: HTMLElement) {
        this.bindCompositionstartEvent(element);
        this.bindCompositionendEvent(element);
        this.bindCompositionupdateEvent(element);
    }


}

export default IRCompositionBinder;