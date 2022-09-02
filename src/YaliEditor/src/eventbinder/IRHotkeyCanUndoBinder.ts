import YaLiEditor from "..";
import { BaseEventBinder } from "../../types";
import { findClosestByAttribute,findClosestByClassName,findClosestByTop} from "../util/findElement";
import {toKeyText} from "../util/formatText"
import rangy from "rangy";
import CONSTANTS from "../constants";
import log from "../util/loging";
import { DeleteBlockCommand, DeleteInlineCommand, DeleteTextCommand, EnterCommand } from "../undo/IRUndoManager";



class IRHotkeyCanUndoBinder implements BaseEventBinder{

    public editor:YaLiEditor;

    //快捷键映射表
    public defaultKeyMap:Object;


    constructor(editor:YaLiEditor) {
        this.editor = editor;
        this.defaultKeyMap = {
            "ctrl+1": this.headingKey,
            "ctrl+2": this.headingKey,
            "ctrl+3": this.headingKey,
            "ctrl+4": this.headingKey,
            "ctrl+5": this.headingKey,
            "ctrl+6": this.headingKey,
            "ctrl+z": this.undoKey,
        }
    }

    /**
     * 撤销操作
     * @param event 
     */
    undoKey(event: KeyboardEvent & { target: HTMLElement }){
        console.log("触发undo快捷键");
        
        this.editor.ir.undo()
    }


    /**
     * 标题快捷键
     * @param event 
     */
    headingKey(event: KeyboardEvent & { target: HTMLElement }){
           
            const r = rangy.getSelection().getRangeAt(0)
            
            const start =  r.startContainer

            let e = findClosestByAttribute(start,"md-block","",this.editor.ir.getRootElementClassName())

            if(!e){
                e = findClosestByTop(start,this.editor.ir.getRootElementClassName())
            }   
            
            //判断是否已经是heading
            if(e.getAttribute("md-block") === "heading"){
                
                //已经是heading
                //判断是否为相同
                if(e.tagName.charAt(1) != event.key){
                    //删除现有的
                    const text = e.innerText
                    r.selectNode(e)
                    r.deleteContents()
                    //改成对应的
                    const pre = "#".repeat(parseInt(event.key)) + " "
                    let res = this.editor.ir.renderer.render(pre+text)
                    
                    const div = document.createElement('div')
                    div.innerHTML = res;
                    //插入新的
                    const node = div.childNodes[0]
                    r.insertNode(node)
                    r.collapseToPoint(node,1)
                    rangy.getSelection().setSingleRange(r)
                    return ; 
                }

                //删除现有的
                const text = e.innerText
                r.selectNode(e)
                r.deleteContents()

                //相同撤销
                const p = document.createElement("p")
                p.innerText = text;
                r.insertNode(p)
                r.collapseToPoint(p,1)
                rangy.getSelection().setSingleRange(r)
            }else{
                //不存在head
                //生成元素
                const turndown = this.editor.ir.parser.turndown(e.outerHTML)
                const pre = "#".repeat(parseInt(event.key)) + " "
                const res = this.editor.ir.renderer.render(pre+turndown)
        
                const div = document.createElement('div')
                div.innerHTML = res;
        
                //删除
                r.selectNode(e)
                r.deleteContents()
                //插入新的
                const node = div.childNodes[0]
                r.insertNode(node)
                r.collapseToPoint(node,1)
                rangy.getSelection().setSingleRange(r)
                //rangy.getSelection().collapseToEnd()
            }
    }


    /**
     * 回车键处理
     * @param event 
     * @returns 
     */

    enterKey(event: KeyboardEvent & { target: HTMLElement }){
        this.editor.ir.execute(new EnterCommand(this.editor))
        event.preventDefault()
    }
    /**
     * 删除键处理
     * @param event 
     */
    deleteKey(event: KeyboardEvent & { target: HTMLElement }){
        const r = rangy.getSelection().getRangeAt(0)
        let start = r.startContainer
        let end =  r.endContainer
        //单一的删除
        if(rangy.getSelection().isCollapsed){
            if(start.nodeType === 3){
                start = start.parentElement;
            }
            let e = start as HTMLElement
            //删除元数据类
            if(e.classList.contains(CONSTANTS.CLASS_MD_META)){
                //元数据类更改，应该影响内容的展示和标签的实际功能
                this.editor.ir.execute(new DeleteTextCommand(this.editor))
                event.preventDefault()
                return 
            }
            //删除隐藏类
            if(e.classList.contains(CONSTANTS.CLASS_MD_HIDEN)){
                //寻找行级模块
                e = findClosestByAttribute(e,CONSTANTS.ATTR_MD_INLINE,"",this.editor.ir.getRootElementClassName())
                //寻找块级模块
                if(!e){
                    e = findClosestByAttribute(e,CONSTANTS.ATTR_MD_BLOCK,"",this.editor.ir.getRootElementClassName())
                }
                //选择最顶层元素
                if(!e){
                    e = findClosestByTop(e,this.editor.ir.getRootElementClassName())
                }
                if(e.hasAttribute(CONSTANTS.ATTR_MD_INLINE)){
                    r.selectNode(e)
                    r.setStartBefore(e)
                    r.setEndAfter(e)
                    rangy.getSelection().setSingleRange(r)
                    event.preventDefault()
                }
                return;
            }
            //删除代码
            if(e.classList.contains(CONSTANTS.CODEMIRROR_LINE)){
                //来自代码块的操作，获取到的是已经删除后的代码
                e = findClosestByClassName(e,CONSTANTS.CODEMIRROR_EDITOR,this.editor.ir.getRootElementClassName())
                if(e.getAttribute("is-empty") == "true"){
                    /*if(e.innerText.length==1 && e.innerText == "\n"){}*/
                    if(e.hasAttribute("ready-destroy")){
                        const parent = e.parentElement
                        this.editor.ir.renderer.codemirrorManager.viewDestroy(e.parentElement.id)
                        parent.remove()
                        //console.log(e.parentElement);
                        //e.parentElement.parentElement.removeChild(e.parentElement)
                    }
                    e.parentElement
                    e.setAttribute("ready-destroy","1")
                }
                return;
            }
            return ;
        }else{
            event.preventDefault()
            //删除一个节点的
            if(r.getNodes().length==1){
                this.editor.ir.execute(new DeleteTextCommand(this.editor))
                return 
            }

            //删除多个节点的
            if(r.getNodes().length>1){
                let startElement = findClosestByAttribute(start,CONSTANTS.ATTR_MD_INLINE,"",this.editor.ir.getRootElementClassName())
                let endElement = findClosestByAttribute(end,CONSTANTS.ATTR_MD_INLINE,"",this.editor.ir.getRootElementClassName())
                if(startElement!=null && endElement!=null){
                    //两个都同为一个md-inline
                    if(startElement === endElement){
                        this.editor.ir.execute(new DeleteInlineCommand(this.editor),startElement,r)
                        return ;
                    }else{//不为同一个md-inline
                        this.editor.ir.execute(new DeleteBlockCommand(this.editor),startElement,endElement,r)
                    }
                }
                

                if(!startElement) startElement = findClosestByAttribute(start,CONSTANTS.ATTR_MD_BLOCK,"",this.editor.ir.getRootElementClassName())
                if(!endElement)endElement = findClosestByAttribute(end,CONSTANTS.ATTR_MD_BLOCK,"",this.editor.ir.getRootElementClassName())
                
                //两个都同为一个md-block
                this.editor.ir.execute(new DeleteBlockCommand(this.editor),startElement,endElement,r)

                return
            }

            return;
        }
    }

    /**
     * 是否为目标键
     * 目标键:crtl,shift,alt,enter,delete,backspace
     * @param event 
     * @returns 
     */
    isTargetKey(event: KeyboardEvent){
        return event.ctrlKey || event.shiftKey || event.altKey || event.key === "Enter" || event.key === "Delete"
        || event.key === "Backspace"
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

        
        //回车键处理
        if(event.key === "Enter"){
            this.enterKey(event)
            //this.editor.ir.addUndo()
            return ;
        }

        //删除键处理,回退键
        if(event.key === "Backspace"){
            this.deleteKey(event)
            //this.editor.ir.addUndo()
            return ;
        }

        //快捷键处理
        const key = toKeyText(event)

        
        const f:Function =  this.defaultKeyMap[key]
        if(f){
            f.call(this,event)
        }
      })
    
    }
    

    bindEvent(element: HTMLElement): void {

        this.bindKeydownEvent(element)
        //this.bindKeyupEvent(element)
    }
    

}

export default IRHotkeyCanUndoBinder;