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
            //更新焦点元素
            this.editor.ir.focueProcessor.updateFocusElement()
            this.editor.ir.focueProcessor.updateBookmark()

            //强制让IR面板最后留一个空行
            if(this.editor.ir.rootElement.lastElementChild.tagName != "P"){
                this.editor.ir.rootElement.appendChild(createParagraph())
            }

            //修复删除残留问题
            if(event.key === "Backspace"){
                const r = rangy.getSelection().getRangeAt(0)
                let start =  r.startContainer as HTMLElement
                if(start.nodeType === 3){
                    start = start.parentElement
                }

                if(start.hasAttribute(CONSTANTS.ATTR_MD_INLINE) && start.children.length === 1 && start.children[0].tagName === "BR"){

                    r.selectNode(start)
                    r.deleteContents()
                    r.insertNode(document.createElement("br"))
                    //this.editor.ir.addUndo()
                    return
                }
                //删除元数据类
                if(start.classList.contains(CONSTANTS.CLASS_MD_META)){
                    //元数据类更改，应该影响内容的展示和标签的实际功能
                    let e = findClosestByAttribute(start,CONSTANTS.ATTR_MD_INLINE,"img",this.editor.ir.getRootElementClassName())
                    if(e){
                        const src = e.getElementsByClassName("md-img-url md-hiden md-meta").item(0).textContent
                        e.getElementsByTagName("img").item(0).src =encodeURI(src) 
                    }

                    e = findClosestByAttribute(start,CONSTANTS.ATTR_MD_INLINE,"link",this.editor.ir.getRootElementClassName())
                    if(e){
                        e.getElementsByTagName("a")[0].href = start.innerText
                    }
                    //this.editor.ir.addUndo()
                }
                
            }
            
            return ;
        })
    }



    bindEvent(element: HTMLElement): void {
        super.bindEvent(element)

        this.bindKeydownEvent(element)
        this.bindKeyupEvent(element)
        
        
    }
    

}

export default IRKeyBinder;