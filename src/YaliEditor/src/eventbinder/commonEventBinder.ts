import { BaseEventBinder } from "@/YaliEditor/types";
import YaLiEditor from "..";

class CommonEventBinder implements BaseEventBinder{
    public composingLock:boolean = false;
    constructor() {}
    editor: YaLiEditor;
    
    public bindCompositionstartEvent(element: HTMLElement){
        //输入前触发（打拼英时，触发顺序compositionstart compositionend）
        element.addEventListener("compositionstart", (event: InputEvent) => {
            //上锁，代表在用打字
            this.composingLock = true;
        });

    }

    public bindCompositionendEvent(element: HTMLElement){
        //输入后触发
        element.addEventListener("compositionend", (event: InputEvent) => {
            //解锁，打字结束
            this.composingLock = false;
        });
    }



    public bindEvent(element: HTMLElement){
        this.bindCompositionstartEvent(element);
        this.bindCompositionendEvent(element);
    }


}

export default CommonEventBinder;