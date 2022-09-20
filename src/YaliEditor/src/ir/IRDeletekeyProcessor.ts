import YaliEditor from '../index'
import { findClosestByAttribute, findClosestByClassName, findClosestByTop } from '../util/findElement';
import CONSTANTS from "../constants";
import rangy from "rangy";
import { strToElement } from "../util/inspectElement";

class IRDeletekeyProcessor{

    public editor:YaliEditor;

    constructor(editor:YaliEditor){
        this.editor = editor
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

    deleteCollapsed(event: KeyboardEvent & { target: HTMLElement }){
        let sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        let start = r.startContainer
        let end =  r.endContainer

        this.editor.ir.undoManager.lastBookMark = rangy.getSelection().getBookmark(this.editor.ir.rootElement)
        if(start.nodeType === 3){
            start = start.parentElement;
        }
        let e = start as HTMLElement

        //删除最后的字符
        if(e.textContent.length == 0 || e.textContent == "\n"){
            
            if(e.parentElement && e.parentElement.tagName == "LI"){
                let li = e.parentElement
                let ol = li.parentElement
                li.remove()
                if(ol.childElementCount == 0) ol.remove()
                event.preventDefault()
                return
            }

            if(e.previousElementSibling && e.previousElementSibling.tagName == "PRE"){
                let sibling =  e.previousElementSibling
                e.remove()
                let info = this.editor.ir.renderer.codemirrorManager.getViewInfo(sibling.id)
                let {node,offset} = info.view.domAtPos(info.view.state.doc.length)
                sel.collapse(node,offset)
                event.preventDefault()
                return
            }
        }
        
        

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
                //log("选择行级模块",rangy.getSelection().getRangeAt(0).startContainer,this.editor.options.options.isTestModel)
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
                    

                    let p = document.createElement("p")
                    p.setAttribute("md-block","paragraph")
                    r.insertNode(p)
                    r.collapseToPoint(p,0)
                    rangy.getSelection().setSingleRange(r)
                    parent.remove()
                    
                    event.preventDefault()
                }
                e.setAttribute("ready-destroy","1")
            }
            return;
        }

        return ;
    }

    deleteRang(event: KeyboardEvent & { target: HTMLElement }){
        const r = rangy.getSelection().getRangeAt(0).cloneRange() as RangyRange
        let start = r.startContainer
        let end =  r.endContainer

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


    /**
     * 删除键处理
     * @param event 
     */
    deleteKey(event: KeyboardEvent & { target: HTMLElement }){
        const r = rangy.getSelection().getRangeAt(0)
        //单一的删除
        if(rangy.getSelection().isCollapsed){
            this.deleteCollapsed(event)
        }else{
           this.deleteRang(event)
        }
    }


    public execute(event: KeyboardEvent & { target: HTMLElement }){
        this.deleteKey(event)
    }

}


export default IRDeletekeyProcessor