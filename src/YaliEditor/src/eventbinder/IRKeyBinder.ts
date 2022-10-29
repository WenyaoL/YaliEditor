/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import YaLiEditor from "..";
import { BaseEventBinder } from "../../types";
import { findClosestByAttribute,
        findClosestByClassName,
        findClosestByTop,
        IRfindClosestMdBlock,
        IRfindClosestMdInline,
        IRfindClosestLi
} from "../util/findElement";
import {toKeyText} from "../util/formatText"
import rangy from "rangy";
import CONSTANTS from "../constants";

import CommonEventBinder from "./commonEventBinder";
import { strToElement,createParagraph} from "../util/inspectElement";






class IRKeyBinder extends CommonEventBinder implements BaseEventBinder{



    constructor(editor:YaLiEditor) {
        super(editor)
    }


    /**
     * 是否为目标键
     * 目标键:crtl,shift,alt,enter,delete,backspace
     * @param event 
     * @returns 
     */
    isTargetKey(event: KeyboardEvent){
        return event.ctrlKey || event.shiftKey || event.altKey || event.key === "Enter" || event.key === "Delete"
        || event.key === "Backspace" || event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft"
        || event.key == "ArrowRight" || event.key === "Tab"
    }


    /**
     * 绑定Keydown事件
     * @param element 
     */
    bindKeydownEvent(element: HTMLElement){

        element.addEventListener("keydown",(event: KeyboardEvent & { target: HTMLElement }) => {
        
        // 非目录键不处理
        if (!this.isTargetKey(event)) {
            return false;
        }
        
        //Tab键处理
        if(event.key === "Tab"){
            this.editor.ir.tabkeyProcessor.execute(event)
            return
        }
        
        //回车键处理
        if(event.key === "Enter"){
            this.editor.ir.enterkeyProcessor.execute(event)
            return ;
        }

        //删除键处理,回退键
        if(this.editor.ir.deletekeyProcessor.execute(event)){
            return ;
        }

        //键盘Arrow移动键
        if(this.editor.ir.arrowMoveKeyProcessor.execute(event)){
            return ;
        }
        
        //快捷键处理
        if(this.editor.ir.hotkeyProcessor.execute(event)){
            return ;
        }
        

      },true)
    
    }
    
    /**
     * 绑定keyup事件
     * @param element 
     */
    bindKeyupEvent(element: HTMLElement){
        element.addEventListener("keyup",(event: KeyboardEvent & { target: HTMLElement }) => {

            this.editor.ir.contextRefresher.refresh()
        
            return ;
        })
    }

    bindCopyEvent(element: HTMLElement){
        element.addEventListener("copy",(event: ClipboardEvent & { target: HTMLElement }) => {
            this.editor.ir.copyProcessor.execute(event)
        })
    }

    bindPasteEvent(element: HTMLElement){
        element.addEventListener("paste",(event: ClipboardEvent & { target: HTMLElement }) => {
            this.editor.ir.pasteProcessor.execute(event)
        })
    }


    bindEvent(element: HTMLElement): void {
        super.bindEvent(element)

        this.bindKeydownEvent(element)
        this.bindKeyupEvent(element)
        this.bindCopyEvent(element)
        this.bindPasteEvent(element)
    }
    

}

export default IRKeyBinder;