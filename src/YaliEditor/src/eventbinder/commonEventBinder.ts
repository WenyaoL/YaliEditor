/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { BaseEventBinder } from "@/YaliEditor/types";
import YaLiEditor from "..";

class CommonEventBinder implements BaseEventBinder{
    public composingLock:boolean = false;
    
    public editor: YaLiEditor;
    constructor(editor:YaLiEditor) {
        this.editor = editor
    }
    public bindCompositionstartEvent(element: HTMLElement){
        //输入前触发（打拼英时，触发顺序compositionstart compositionend）
        element.addEventListener("compositionstart", (event: InputEvent & {target:HTMLElement}) => {
            
            //if(event.target.classList.contains("cm-content")) return
            this.editor.ir.focueProcessor.updateBeforeModify()
            //上锁，代表在用打字
            this.composingLock = true;

            this.editor.ir.observer.stop()

            
            
        });

    }

    public bindCompositionendEvent(element: HTMLElement){
        //输入后触发
        element.addEventListener("compositionend", (event: InputEvent & {target:HTMLElement}) => {
            if(!this.composingLock) return
            //解锁，打字结束
            this.composingLock = false;

            this.editor.ir.observer.start()
            this.editor.ir.observer.forceFlush()
        });
    }



    public bindEvent(element: HTMLElement){
        this.bindCompositionstartEvent(element);
        this.bindCompositionendEvent(element);
    }


}

export default CommonEventBinder;