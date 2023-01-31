/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import {createParagraph} from '../util/createElement'
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
        this.groupDelayTime = 500;
        this.lastChange = Date.now()
        this.disable = false
        this.isObserving = false

        this.observer = new MutationObserver(mutations => {
            if(this.editor.ir.rootElement.childElementCount == 0){
                this.editor.ir.rootElement.append(createParagraph())
                this.editor.ir.focus()
            }
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
        //存在延时器(清除当前延时器)
        this.clear()
        //创建新的延时器
        this.delayTimer = window.setTimeout(() => {
            //记录修改
            this.editor.ir.addUndo()
            this.delayTimer = -1;
        }, this.groupDelayTime);
    }

    /**
     * 如果有存在的延时器，现在进行冲刷
     */
    flushNow(){
        this.lastChange = Date.now()
        //存在延时器(清除当前延时器)
        if(this.delayTimer>0){
            clearTimeout(this.delayTimer)
            this.delayTimer = -1;
            this.editor.ir.addUndo()
        }
    }

    /**
     * 自定义刷新
     * @param f 
     */
    flushByCustom(f:Function){
        //存在延时器(清除当前延时器)
        this.clear()
        //创建新的延时器
        this.delayTimer = window.setTimeout(f, this.groupDelayTime);
    }

    /**
     * 强制刷新
     */
    forceFlush(){
        //存在延时器(清除当前延时器)
        this.clear()
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
     * 清除当前的延时器，并刷新时间
     */
    clear(){
        this.lastChange = Date.now()
        //存在延时器(清除当前延时器)
        if(this.delayTimer>0){
            clearTimeout(this.delayTimer)
            this.delayTimer = -1;
        }
    }

    hasDelayTimer(){
        if(this.delayTimer>0) return true
        return false
    }
}