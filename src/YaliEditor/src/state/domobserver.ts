/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { HtmlHTMLAttributes } from "vue";
import {createParagraph} from '../util/inspectElement'
import YaLiEditor from "..";

export class DOMObserver{
    dom: HTMLElement
    win: Window
    editor:YaLiEditor;
    observer: MutationObserver
    disable:boolean
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
        this.disable = false
        this.observer = new MutationObserver(mutations => {
            
            
            
            if(this.editor.ir.rootElement.childElementCount == 0){
                this.editor.ir.rootElement.append(createParagraph())
            }
            let mut = mutations.at(0)
            let e = mut.target as HTMLElement
            if(e.nodeType == 3){
                e = e.parentElement
            }
            
            if(e && e.className && e.parentElement && (e.className.search(/cm-.*/)>=0 || e.parentElement.className.search(/cm-.*/)>=0)){
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
            
            
            
            this.forceFlush()

            
            this.lastChange = Date.now()

        });
    }

    start(){
        if(this.disable) return
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
            this.delayTimer = -1;
        },300)
    }

    adjustNow(){
        if(this.delayTimer>0){
            clearTimeout(this.delayTimer)
            this.editor.ir.undoManager.adjust()
            this.delayTimer = -1;
        }
    }

    forceAdjust(){
        if(this.delayTimer>0){
            clearTimeout(this.delayTimer)
        }
        this.editor.ir.undoManager.adjust()
    }

    flush(){
        if(this.delayTimer>0) return
        //记录修改
        this.editor.ir.addUndo()
    }

    disableObserver(){
        this.observer.disconnect()
        this.disable =true
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