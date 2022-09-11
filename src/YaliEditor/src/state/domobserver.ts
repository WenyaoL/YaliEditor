import { HtmlHTMLAttributes } from "vue";
import YaLiEditor from "..";

export class DOMObserver{
    dom: HTMLElement
    win: Window
    editor:YaLiEditor;
    observer: MutationObserver
    config = { childList: true, subtree: true ,characterData: true,};

    groupDelayTime:number;
    lastChange:number

    delayTimer:number = -1;

    constructor(dom:HTMLElement,editor:YaLiEditor){
        this.dom = dom;
        this.editor = editor;
        //修改分组延时
        this.groupDelayTime = 300;
        this.lastChange = Date.now()

        this.observer = new MutationObserver(mutations => {
            
            
            let mut = mutations.at(0)
            let e = mut.target as HTMLElement
            if(e.nodeType == 3){
                
                e = e.parentElement
            }
            if(e.className.search(/cm-.*/)>=0){
                this.lastChange=Date.now()
                return 
            }

            //
            const now = Date.now()
            if(now-this.lastChange<this.groupDelayTime){       
                this.lastChange = now
                //将记录合并到历史栈顶
                this.adjust()
                return;
            }
            
            
            console.log("记录");
            this.flush()
            this.lastChange = Date.now()

        });
    }

    start(){
        this.lastChange = Date.now()
        this.observer.observe(this.dom,this.config)
    }

    stop() {
        this.observer.disconnect()
    }

    /**
     * 调整历史栈
     */
    adjust(){
        if(this.delayTimer>0){
            clearTimeout(this.delayTimer)
        }
        this.delayTimer = window.setTimeout(()=>{
            this.editor.ir.undoManager.adjust()
        },300)
    }

    flush(){
        if(this.delayTimer>0) return
        //记录修改
        this.editor.ir.addUndo()
    }

    /**
     * 强制刷新
     */
    forceFlush(){
        //记录修改
        this.editor.ir.addUndo()
    }

    ignore<T>(f:()=>T,obj:any):T{
        try{
            this.stop()
            return f.call(obj)
        }finally{
            this.start()
        }
    }
}