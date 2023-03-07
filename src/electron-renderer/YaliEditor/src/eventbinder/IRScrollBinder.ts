import YaLiEditor from "..";
import { BaseEventBinder } from "../../types";

export class IRSelectBinder implements BaseEventBinder {
    editor: YaLiEditor;

    constructor(editor: YaLiEditor) {
        this.editor = editor
    }

    bindScrollEvent(element: HTMLElement) {
        element.addEventListener('scroll', (event: Event) => {


        })
    }

    bindEvent(element: HTMLElement): void {

        this.bindScrollEvent(element)
    }

}

export default IRSelectBinder