/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import YaliEditor from '../index'
import {isMdBlock, isEmptyMdFence, isMdBlockParagraph, isMdBlockToc} from '../util/inspectElement'
import { strToElement,createParagraph,strToNodeArray, strToDocumentFragment} from "../util/createElement";
import rangy from "rangy";
import { IRfindClosestMdBlock } from '../util/findElement';
import Constants from '../constant/constants'
import {} from '../util/inspectElement'

class MarkdownTool{

    public editor:YaliEditor;

    constructor(editor:YaliEditor){
        this.editor = editor
    }

    /**
     * 给定元素，翻译成markdown字符串
     * @param element 
     * @returns 
     */
    turndown(element:HTMLElement,escape:boolean = true){
        let turndown = this.editor.ir.parser.turndown(element.outerHTML)
        //P标签翻译出的markdown语法会被转义，去除头部的转义符
        if(escape) turndown = turndown.replace(/(\\)(?=[\[\]`*.>#$])/g,"")
        return turndown
    }

    /**
     * 重新渲染某个节点
     * @param element 
     */
    reRenderNode(element:HTMLElement){
        if(!element) return false;

        //重新翻译，重新渲染成节点
        let turndown = this.turndown(element)
        const res = this.editor.ir.renderer.render(turndown)

        if(!res) return false;
        
        const e = strToElement(res)
        
        element.replaceWith(e)
        return e
    }

    /**
     * 重新渲染inline元素，如
     * []f() --> inline将会退化为Text
     * f[]()和[]()f --> inline将会转化为一个字符+一个inline元素
     * 
     * @param inline 
     * @returns 退化将会返回Text，其他情况返回inline元素
     */
    reRenderInlineElement(inline:HTMLElement){
        if(!inline) return
        let turndown = this.turndown(inline)

        
        const res = this.renderInline(turndown)

        const df = strToDocumentFragment(res)
        const e = df.firstElementChild 
        if(!e){
            const text = document.createTextNode(res)
            inline.replaceWith(text)
            return text
        }
               
        inline.replaceWith(df)
        return e
    }

    /**
     * 给定一个md-block,以renderInline规则重新渲染md-block中的文本
     * @param block 
     * @returns 
     */
    reRenderInlineElementAtBlock(block:HTMLElement){
        if(!block) return false;
        let turndown = this.turndown(block)
        const res = this.renderInline(turndown)
        block.replaceChildren(...strToNodeArray(res))
        return block
    }


    /**
     * 给定一个md-block,以renderBlock规则重新渲染整个md-block
     * @param block 
     * @returns 
     */
    reRenderBlockElement(block:HTMLElement){
        if(!block || !isMdBlock(block)) return false;
        let turndown = this.turndown(block)
        const res = this.renderBlock(turndown)
        const e = strToElement(res)
        block.replaceWith(e)
        return e
    }

    renderInline(str:string){
        return this.editor.ir.renderer.md.renderInline(str)
    }

    renderBlock(str:string){
        return this.editor.ir.renderer.md.render(str)
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

    mdInlineDegenerateToText(inline:HTMLElement){
        if(!inline) return
        let turndown = this.turndown(inline)
        const res = this.renderInline(turndown)
        const e = strToElement(res)
        if(e) return
        const text = document.createTextNode(res)
        inline.replaceWith(text)
        return text
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
            
        }else if(isEmptyMdFence(element)){
            this.editor.ir.renderer.codemirrorManager.viewDestroy(element.id)
            return this.nodeDegenerateToP(element)
        }

        return;
    }


    /**
     * 参试转换md-block,发生标签转换将会对元素进行替换，并返回替换的元素
     * @param block 
     * @returns 
     */
    mdBlockTransform(block:HTMLElement){
        if(!block) return;
        let turndown = this.turndown(block)
        const res = this.renderBlock(turndown)
        const e = strToElement(res) as HTMLElement
        if(!e) return
        //块没发生转换不进行处理
        if(e.tagName == block.tagName) return

        if(e.innerText.length == 0) return
        block.replaceWith(e)
        if(isMdBlockToc(e)) this.editor.ir.contextRefresher.refreshToc()
        return e
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
            if(element.textContent != "\n"  && element.textContent.length != 0){
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

    /**
     * 
     * @param element 
     */
    getParagraphLastTextNode(element:HTMLElement){
        if(!element || !isMdBlockParagraph(element)) return false

        if(element.textContent.length == 0 && element.innerText.length == 0){
            const br = document.createElement("br")
            element.appendChild(br)
            return br
        } 
        
        return element.lastChild
    }

    /**
     * 给定元素，通过元素来判断是否需要对光标进行偏移或者选择
     */
    deviationCursor(element:HTMLElement){
        if(!element) return
        let sel = rangy.getSelection()
        let r = sel.getRangeAt(0)

        //点击图片进行光标偏移
        if(element.tagName == "IMG"){
            r.collapseAfter(element.previousElementSibling?.lastElementChild)
            sel.setSingleRange(r)
        }

        if(element.classList.contains("MathJax")){
            let editor = IRfindClosestMdBlock(element).getElementsByClassName("markdown-it-code-beautiful").item(0)
            let viewInfo = this.editor.ir.renderer.codemirrorManager.getViewInfo(editor.id)
            let {node,offset} = viewInfo.view.domAtPos(viewInfo.view.state.doc.length)
            sel.collapse(node,offset)
        }
    }


    /**
     * 修补字符串
     * @param src 
     */
    htmlPatch(src:string){
        let match = src.match(/<t[hr]>/)
        if(!match || match.length==0) return src
        else{
            match = src.match(/<table>/)
            if(!match || match.length==0) return "<table>" + src + "</table>"
        }
        return src
    }   

    /**
     * 给Codemirror6编辑面板添加元素text,text内容为编辑内容
     * @param root 
     */
    fixCodemirror6Element(root:HTMLElement){
        let es = root.getElementsByClassName(Constants.CLASS_MD_CODE)

        for (let index = 0; index < es.length; index++) {
            const element = es[index];
            let text = this.editor.ir.renderer.codemirrorManager.getTextValue(element.id)            
            element.appendChild(document.createTextNode(text))
        }
    }

    removeAllCodemirror6Element(root:HTMLElement){
        let es = root.getElementsByClassName(Constants.CLASS_MD_CODE)

        for (let index = 0; index < es.length; index++) {
            const element = es[index];
            let input = element.getElementsByTagName("input").item(0)
            if(input) element.setAttribute("lang",input.getAttribute("lang"))
            element.innerHTML = ""
        }
    }



}

export default MarkdownTool