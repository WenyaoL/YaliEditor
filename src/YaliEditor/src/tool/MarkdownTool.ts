import YaliEditor from '../index'
import {strToDocumentFragment,strToNodeArray,strToNodeList,createParagraph} from '../util/inspectElement'
import rangy from "rangy";

class MarkdownTool{

    public editor:YaliEditor;

    constructor(editor:YaliEditor){
        this.editor = editor
    }

    /**
     * 重新渲染某个节点
     * @param element 
     */
    reRenderNode(element:HTMLElement){
        if(!element) return false;

        //重新翻译，重新渲染成节点
        const turndown = this.editor.ir.parser.turndown(element.outerHTML)
        const res = this.editor.ir.renderer.render(turndown)

        if(!res) return false;
        
        const nodes = strToNodeArray(res)
        
        element.replaceWith(...nodes)
    }


    /**
     * 对节点模块进行退化操作
     * 节点将会被退化成P标签
     * @param element 
     * @returns 返回退化的P标签
     */
    nodeDegenerateToP(element:HTMLElement){
        let p = createParagraph()
        element.replaceWith(p)
        return p
    }

    /**
     * 整个MD-Block块将会被退化成P标签
     * @param element 
     * @returns 返回退化的P标签
     */
    mdBlockDegenerateToP(element:HTMLElement){
        if(!element) return;

        //不存在任何文本标签将会被退化
        if(element.innerText.length == 0 || element.innerText == "\n"){
            //P标签需要分类讨论
            if(element.tagName == "P" && !element.previousElementSibling  && !element.nextElementSibling && element.parentElement
            &&element.parentElement.tagName == "BLOCKQUOTE"){
                //父标签是BLOCKQUOTE，父标签退化
                return this.nodeDegenerateToP(element.parentElement)
            }else if(element.tagName != "P"){
                return this.nodeDegenerateToP(element)
            }
            
        }
        return;
    }


    /**
     * 
     * @param element 
     * @returns 
     */
    getLastTextNode(element:Node):Node{
        if(!element) return;

        if(element.nodeType == 3){
            //块与块之间会可能有一个隐藏的textNode textContent=="\n"
            if(element.textContent != "\n"){
                return element
            }else{
                //向前移动
                return this.getLastTextNode(element.previousSibling)
            }
        }else{//不是文本节点
            let text = this.getLastTextNode(element.lastChild)
            if(text){ return text}
            else{
                return this.getLastTextNode(element.previousSibling)
            }
            
        }
        
        
    }


}

export default MarkdownTool