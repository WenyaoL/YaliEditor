import YaLiEditor from "..";
import { BaseEventBinder } from "../../types";
import { findClosestByAttribute,findClosestByClassName,findClosestByTop} from "../util/findElement";
import {toKeyText} from "../util/formatText"
import rangy from "rangy";
import CONSTANTS from "../constants";
import log from "../util/loging";
import CommonEventBinder from "./commonEventBinder";






class IRHotkeyBinder extends CommonEventBinder implements BaseEventBinder{



    public editor:YaLiEditor;

    //快捷键映射表
    public defaultKeyMap:Object;


    constructor(editor:YaLiEditor) {
        super(editor)
        //this.editor = editor;
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
        const r = rangy.getSelection().getRangeAt(0)
        let start = r.startContainer
        if(start.nodeType === 3){
            start = start.parentElement;
        }
        let e = start as HTMLElement
        //来自代码的不处理
        if(e.classList.contains(CONSTANTS.CODEMIRROR_LINE)){
            return
        }
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
                    
                    if(!text || text == "\n" || text.length == 0) div.firstElementChild.innerHTML = "<br>"
                    //插入新的
                    const node = div.firstElementChild as HTMLElement
                    r.insertNode(node)
                    r.collapseToPoint(node,1)
                    rangy.getSelection().setSingleRange(r)
                    node.click()
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
                p.click()
            }else{
                //不存在head
                //生成元素
                const turndown = this.editor.ir.parser.turndown(e.outerHTML)
                const pre = "#".repeat(parseInt(event.key)) + " "
                const res = this.editor.ir.renderer.render(pre+turndown)
                
                const div = document.createElement('div')
                div.innerHTML = res;
                
                if(!turndown) div.firstElementChild.innerHTML = "<br>"
                
                //删除
                r.selectNode(e)
                r.deleteContents()
                //插入新的
                const node = div.childNodes[0] as HTMLElement
                r.insertNode(node)
                r.collapseToPoint(node,1)
                rangy.getSelection().setSingleRange(r)
                //rangy.getSelection().collapseToEnd()
                node.click()
            }
    }


    /**
     * 回车键处理
     * @param event 
     * @returns 
     */

    enterKey(event: KeyboardEvent & { target: HTMLElement }){
        const r = rangy.getSelection().getRangeAt(0)
        let start =  r.startContainer
        
        const e = findClosestByTop(start,this.editor.ir.getRootElementClassName())
        if(e.tagName === "PRE"){
            //代码块不处理
            return;
        }
        if(r.endOffset === 0){
            r.collapseBefore(e)
            const p = document.createElement("p")
            p.setAttribute("md-block","paragraph")
            p.innerHTML = "<br>"
            r.insertNode(p)

            event.preventDefault()
        }else{
            r.collapseAfter(e)
            const p = document.createElement("p")
            p.innerHTML = "<br>"
            p.setAttribute("md-block","paragraph")
            r.insertNode(p)
            //光标选择聚焦新元素
            rangy.getSelection().collapse(p,0)
            event.preventDefault()
        }
        
        


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
                        parent.remove()
                        
                        rangy.getSelection().setSingleRange(r)
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
        const key = toKeyText(event)
        
        const f:Function =  this.defaultKeyMap[key]
        if(f){
            f.call(this,event)
            event.preventDefault()
            //this.editor.ir.addUndo()
        }
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