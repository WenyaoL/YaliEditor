/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import YaliEditor from '../index'
import { findClosestByAttribute, 
    findClosestByClassName, 
    findClosestByTop,
    IRfindClosestMdBlock 
} from '../util/findElement';
import CONSTANTS from "../constants";
import rangy from "rangy";
import { strToElement } from "../util/inspectElement";
import {KeyProcessor} from './KeyProcessor'

class IRDeletekeyProcessor implements KeyProcessor{

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

        //无字符删除的情况
        if(e.textContent.length == 0 || e.innerText == "\n"){
            
            //删除的是表格
            if(e && e.tagName == "TD" || e.tagName == "TH"){
                if(e.previousElementSibling){
                    let element = e.previousElementSibling
                    let coll = 0
                    if(element.textContent && element.textContent.length> 0) coll = 1
                    sel.collapse(e.previousElementSibling,coll)
                }else if(e.parentElement.previousElementSibling){
                    let element = e.parentElement.previousElementSibling
                    let coll = 0
                    if(element.lastElementChild.textContent.length > 0) coll = 1
                    sel.collapse(element.lastElementChild,coll)
                }
                //event.preventDefault()
                return
            }

            //删除的是列表
            if(e.parentElement && e.parentElement.tagName == "LI"){
                let li = e.parentElement
                let ol = li.parentElement
                li.remove()
                if(ol.childElementCount == 0) ol.remove()
                event.preventDefault()
                return
            }

            //删除发生在代码块旁边
            if(e.previousElementSibling && e.previousElementSibling.tagName == "PRE"){
                let sibling =  e.previousElementSibling
                e.remove()
                let info = this.editor.ir.renderer.codemirrorManager.getViewInfo(sibling.id)
                let {node,offset} = info.view.domAtPos(info.view.state.doc.length)
                sel.collapse(node,offset)
                event.preventDefault()
                return
            }
            
            //删除发生在公式块旁边
            if(e.previousElementSibling && e.previousElementSibling.classList.contains("markdown-it-mathjax-beautiful")){
                let sibling =  e.previousElementSibling.getElementsByClassName("md-mathblock-input")[0]
                e.remove()
                let info = this.editor.ir.renderer.codemirrorManager.getViewInfo(sibling.id)
                let {node,offset} = info.view.domAtPos(info.view.state.doc.length)
                sel.collapse(node,offset)
                this.editor.ir.focueProcessor.updateFocusElement()
                event.preventDefault()
                return
            }

            if(e.previousElementSibling){
                let sibling =  e.previousElementSibling
                e.remove()
                let siblingChildNum = sibling.childNodes.length
                sel.collapse(sibling,siblingChildNum)
                this.editor.ir.focueProcessor.updateFocusElement()
                event.preventDefault()
                return
            }else{
                event.preventDefault()
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
            if(!e) return
            if(e.hasAttribute(CONSTANTS.ATTR_MD_INLINE)){

                r.selectNodeContents(e)
                //r.selectNode(e)


                rangy.getSelection().setSingleRange(r)
                //rangy.getSelection().deleteFromDocument();
                
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
            return;
        }

        //校正删除LINK
        start = r.startContainer
        let startOff = r.startOffset
        //模拟字符删除
        if(startOff==1 && start.previousSibling && start.previousSibling.nodeType==1 &&start.nodeType ==3){
            let sib = start.previousSibling as HTMLElement
            if(sib.getAttribute(CONSTANTS.ATTR_MD_INLINE) == CONSTANTS.ATTR_MD_INLINE_LINK){
                r.setStart(start,startOff-1)
                r.deleteContents()
                event.preventDefault()
                return 
            }
        }
        
        
        return ;
    }

    deleteRang(event: KeyboardEvent & { target: HTMLElement }){
        const r = rangy.getSelection().getRangeAt(0).cloneRange() as RangyRange
        let start = r.startContainer
        let end =  r.endContainer

        if(this.editor.ir.focueProcessor.getSelectedBlockMdType() == CONSTANTS.ATTR_MD_BLOCK_FENCE){
            return
        }
        
        event.preventDefault()
        //删除一个节点的
        if(r.getNodes().length==1){
            r.deleteContents()
            //this.editor.ir.addUndo()
        }

        //删除多个节点的
        if(r.getNodes().length>1){
            let startElement = IRfindClosestMdBlock(start)
            let endElement = IRfindClosestMdBlock(end)
  
            
            let startOffset = r.startOffset
            //相同的情况
            if(startElement === endElement){
                
                
                //删除内容
                r.deleteContents()
            
                
                if(!this.renderNode(startElement,r)){
                    //翻译出是空的情况
                    startElement.innerHTML = ""
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
        }else{//范围删除
           this.deleteRang(event)
        }
    }


    public execute(event: KeyboardEvent & { target: HTMLElement }){
        if(event.key != "Backspace") return false

        //修改动作前的跟新
        this.editor.ir.focueProcessor.updateBeforeModify()
        this.deleteKey(event)
        return true
    }

}


export default IRDeletekeyProcessor