import YaLiEditor from "..";
import { BaseEventBinder } from "../../types";

export class IRSelectBinder implements BaseEventBinder{
    editor: YaLiEditor;

    constructor(editor:YaLiEditor){
        this.editor = editor
    }

    bindScrollEvent(element: HTMLElement){
        element.addEventListener('scroll',(event:Event)=>{
            console.log("滚动中");
            
        })
    }

    bindEvent(element: HTMLElement): void {
        console.log("绑定");
        
        this.bindScrollEvent(element)
    }

}

export default IRSelectBinder