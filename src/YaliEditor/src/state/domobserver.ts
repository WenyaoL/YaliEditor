/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import {createParagraph} from '../util/inspectElement'
import YaLiEditor from "..";

export class DOMObserver{
    dom: HTMLElement
    editor:YaLiEditor;
    observer: MutationObserver;
    //dom观测器不可用(disabel状态下将，无法进行任何操作)
    disable:boolean;
    //dom是否在观察中(start(),stop()方法都会切换该状态)
    isObserving:boolean;
    config = { childList: true, subtree: true ,characterData: true,};
    //组延时
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
        this.isObserving = false

        this.observer = new MutationObserver(mutations => {

            if(this.editor.ir.rootElement.childElementCount == 0){
                this.editor.ir.rootElement.append(createParagraph())
            }
            let mut = mutations.at(0)
            
            let e = mut.target as HTMLElement
            if(e.nodeType == 3){
                e = e.parentElement
            }
            
            if(this.filt(e)) return

            this.flush()

        });
    }

    start(){
        if(this.disable) return
        this.isObserving = true
        this.lastChange = Date.now()
        this.observer.observe(this.dom,this.config)
    }

    stop() {

        this.isObserving = false
        this.observer.disconnect()
    }

    /**
     * 刷新
     * @returns 
     */
    flush(){
        const now = Date.now()
        this.lastChange = now
        //存在延时器(清除当前延时器)
        if(this.delayTimer>0){
            clearTimeout(this.delayTimer)
            this.delayTimer = -1;
        }
        //创建新的延时器
        this.delayTimer = window.setTimeout(() => {
            //记录修改
            this.editor.ir.addUndo()
            this.delayTimer = -1;
        }, this.groupDelayTime);
        
    }

    /**
     * 强制刷新
     */
    forceFlush(){
        const now = Date.now()
        this.lastChange = now
        //存在延时器(清除当前延时器)
        if(this.delayTimer>0){
            clearTimeout(this.delayTimer)
            this.delayTimer = -1;
        }

        //记录修改
        this.editor.ir.addUndo()

    }

    disableObserver(){
        if(this.delayTimer>0){
            clearTimeout(this.delayTimer)
        }
        this.observer.disconnect()
        this.disable =true
    }



    /**
     * 在执行函数期间忽略观察
     * 执行完函数，回复为原本状态，如：
     * 原本状态（关）  --> 执行函数（关） --> 保持关闭（关）
     * 原本状态（开）  --> 执行函数（关） --> 重新开启（开）
     * @param f 
     * @param obj 
     * @returns 
     */
    ignore<T>(f:()=>T,obj:any):T{
        let flag = this.isObserving
        try{
            if(flag) this.stop()
            return f.call(obj)
        }finally{
            if(flag){
                this.start()
            }
        }
    }

    /**
     * 过滤一些不需要侦查的元素
     */
    filt(e:Element){
        if(!e) return false
        if(e && e.className && e.parentElement && (e.className.search(/cm-.*/)>=0 || e.parentElement.className.search(/cm-.*/)>=0)){
            return true
        }

        if(e.className == "el-input__wrapper"){
            return true
        }

        return false
    }
}