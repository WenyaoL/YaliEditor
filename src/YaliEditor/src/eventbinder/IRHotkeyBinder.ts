import YaLiEditor from "..";
import { BaseEventBinder } from "../../types";
import { findClosestByAttribute,
        findClosestByClassName,
        findClosestByTop,
        findClosestMdBlock,
} from "../util/findElement";
import {toKeyText} from "../util/formatText"
import rangy from "rangy";
import CONSTANTS from "../constants";
import log from "../util/loging";
import CommonEventBinder from "./commonEventBinder";






class IRHotkeyBinder extends CommonEventBinder implements BaseEventBinder{



    constructor(editor:YaLiEditor) {
        super(editor)
    }




    /**
     * 回车键处理
     * @param event 
     * @returns 
     */

    enterKey(event: KeyboardEvent & { target: HTMLElement }){
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0)
        let start =  r.startContainer
        r.commonAncestorContainer
        //const e = findClosestByTop(start,this.editor.ir.getRootElementClassName())

        const e = findClosestMdBlock(start)
        console.log(start);
        
        if(e.tagName === "PRE"){
            //代码块不处理
            return;
        }
        //光标是否聚合（坍塌）
        if(!r.collapsed) r.deleteContents()

        r.setEndAfter(e);
        //剪切
        let content = r.extractContents()
        let block = content.children.item(0)
        if(block.textContent.length===0){
            block.innerHTML = "<br>"
        }
        r.collapseAfter(e);
        r.insertNode(content);
        r.collapseToPoint(e.nextElementSibling,0)
        sel.setSingleRange(r);
        event.preventDefault()

        
    }

    /**
     * 重新渲染某一节点
     */
    renderNode(element:HTMLElement,r:RangyRange){
        if(!element) return false;
        const turndown = this.editor.ir.parser.turndown(element.outerHTML)
        const res = this.editor.ir.renderer.render(turndown)
        if(!res) return false;
        //临时div
        const div = document.createElement("div")
        div.innerHTML = res;
        if(div.firstElementChild.hasAttribute(CONSTANTS.ATTR_MD_INLINE)){
            //翻译出的是MD_INLINE块
            //删除原本整个MD_INLINE块
            r.selectNode(element)
            r.deleteContents()
            //在插入
            r.insertNode(div.firstChild)
        }
        if(div.firstElementChild.hasAttribute(CONSTANTS.ATTR_MD_BLOCK)){
            //翻译出的是MD_BLOCK块
            //删除原本整个MD_INLINE块
            r.selectNode(element)
            r.deleteContents()
            //在插入文本节点
            r.insertNode(document.createTextNode(div.innerText))
        }
        return true;
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
            this.editor.ir.undoManager.lastBookMark = rangy.getSelection().getBookmark(this.editor.ir.rootElement)
            if(start.nodeType === 3){
                start = start.parentElement;
            }
            let e = start as HTMLElement

            //删除元数据类
            if(e.classList.contains(CONSTANTS.CLASS_MD_META)){
                //元数据类更改，应该影响内容的展示和标签的实际功能
                return;
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
                    //rangy.getSelection().deleteFromDocument();
                    log("选择行级模块",rangy.getSelection().getRangeAt(0).startContainer,this.editor.options.options.isTestModel)
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
                        this.editor.ir.renderer.codemirrorManager.viewDisable(e.parentElement.id)
                        r.setStartBefore(parent)
                        rangy.getSelection().setSingleRange(r)
                        parent.remove()
                        
                        event.preventDefault()
                    }
                    e.setAttribute("ready-destroy","1")
                }
                return;
            }

            return ;
        }else{
            event.preventDefault()
            //删除一个节点的
            if(r.getNodes().length==1){
                r.deleteContents()
                //this.editor.ir.addUndo()
            }

            //删除多个节点的
            if(r.getNodes().length>1){
                let startElement = findClosestByAttribute(start,CONSTANTS.ATTR_MD_INLINE,"",this.editor.ir.getRootElementClassName())
                let endElement = findClosestByAttribute(end,CONSTANTS.ATTR_MD_INLINE,"",this.editor.ir.getRootElementClassName())
                let startOffset = r.startOffset
                //相同的情况
                if(startElement === endElement){
                    //删除内容
                    r.deleteContents()
                    if(!this.renderNode(startElement,r)){
                        //this.editor.ir.addUndo()
                        return;
                    }
                    r.collapseToPoint(r.startContainer.firstChild,startOffset)
                    rangy.getSelection().setSingleRange(r)
                }else{
                    //起始和结束容器不一样的情况
                    //删除内容
                    r.deleteContents()

                    //重新渲染起始容器
                    this.renderNode(startElement,r)

                    r.setEnd(endElement,0)
                    //重新渲染结束容器
                    this.renderNode(endElement,r)
                }
                //this.editor.ir.addUndo()
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

        this.editor.ir.hotkeyProcessor.execute(event)
      })
    
    }
    
    /**
     * 绑定keyup事件
     * @param element 
     */
    bindKeyupEvent(element: HTMLElement){
        element.addEventListener("keyup",(event: KeyboardEvent & { target: HTMLElement }) => {
            
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

export default IRHotkeyBinder;