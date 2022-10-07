/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import IR from '.';
import YaliEditor from '../index'
import Constants from '../constants';
import { strToElement,createParagraph} from "../util/inspectElement";
import rangy from 'rangy';
class IRContextRefresher{

    public editor:YaliEditor;
    public ir:IR

    constructor(editor:YaliEditor){
        this.editor = editor
        this.ir = this.editor.ir
    }

    /**
     * 刷新
     */
    refresh(){

        //强制让IR面板最后留一个空行
        if(this.editor.ir.rootElement.lastElementChild.tagName != "P"){
            this.editor.ir.rootElement.appendChild(createParagraph())
        }

        //补丁类的刷新(忽略补丁监控)
        this.ir.observer.ignore(()=>{
            this.refreshLink()
            this.refreshImg()
            this.refreshHeading()
            this.refreshTable()
            this.refreshToc()
        },this)


        //更新焦点元素
        this.editor.ir.focueProcessor.updateFocusElement()
        this.editor.ir.focueProcessor.updateBookmark()
    }   

    /**
     * 刷新聚焦的行
     */
    refreshFocusInline(){
        //根据行类型选择是否强制刷新块
        let inlineType = this.editor.ir.focueProcessor.getSelectedInlineMdType()
        if(inlineType == Constants.ATTR_MD_INLINE_IMG || inlineType == Constants.ATTR_MD_INLINE_LINK){
            this.refreshFocusBlock(true)
            return true
        }
        return false
    }

    /**
     * 刷新聚焦的块级元素，只有在标签发生转变时才对变化进行渲染
     * 如：
     * p  --重新翻译为markdown再重新转化为HTML--> p (该变化将不会被渲染到页面，除非使用强制刷新)
     * p  ---->  h2  (节点发生变化，渲染到页面)
     * @returns 
     */
    refreshFocusBlock(force?:boolean){
        let sel = rangy.getSelection()
        let r = sel.getRangeAt(0)
        //获取当前所在的块
        let block = this.editor.ir.focueProcessor.getSelectedBlockMdElement()
        if(!block) return
        let turndown = this.editor.ir.parser.turndown(block.outerHTML)

        //P标签翻译出的markdown语法会被转义，去除头部的转义符
        //turndown = turndown.replace(/(\\)(?=[^\\])/g,"")
        turndown = turndown.replace(/(\\)(?=[\\\[\]\`])/g,"")
        
        if(turndown.charAt(0) == "\\"){
            turndown = turndown.slice(1)
        }
        //转html
        const res = this.editor.ir.renderer.render(turndown)


        
        if(!block.parentElement){
            this.editor.ir.focueProcessor.updateFocusElement()
            block = this.editor.ir.focueProcessor.getSelectedBlockMdElement()
        }
        
        if(!res) return
        //转化为dom
        let e = strToElement(res)

        
        //只有发生转化为新块时才刷新
        if(e.tagName!="P" && e.textContent.length!= 0){

            
            //已经转化为新的块
            block.replaceWith(e)
            sel.collapse(e,1)
            this.editor.ir.focueProcessor.updateFocusElement()
        }else{
            //强制刷新?
            /*if(force){         
                       
                let bookmark = sel.getBookmark(block)
                bookmark.rangeBookmarks[0].containerNode = e
                block.replaceWith(e)
                sel.moveToBookmark(bookmark)
                this.editor.ir.focueProcessor.updateFocusElement()
                return
            }*/

            if(e.textContent.length== 0){
                return
            }

            if(e?.innerHTML!=block?.innerHTML){
                let bookmark = sel.getBookmark(block)
                bookmark.rangeBookmarks[0].containerNode = e
                block.replaceWith(e)
                sel.moveToBookmark(bookmark)
                this.editor.ir.focueProcessor.updateFocusElement()
                return
            }

            return
        }
    }

    /**
     * 刷新table（补丁）
     */
    refreshTable(){
        let root = this.ir.rootElement

        let tds = root.getElementsByTagName("td")
        for (let index = 0; index < tds.length; index++) {
            const element = tds[index];
            if(element.innerText== "\n"){
                element.innerText = "";
            }
        }

        let ths = root.getElementsByTagName("th")
        for (let index = 0; index < ths.length; index++) {
            const element = ths[index];
            if(element.innerText== "\n"){
                element.innerText = "";
            }
        }
    }


    /**
     * 刷新上下文中链接节点
     */
    refreshLink(){
        let root = this.ir.rootElement
        let links = root.querySelectorAll(Constants.SELECTOR_MD_INLINE_LINK)
        links.forEach(link=>{
            let a = link.getElementsByTagName("a").item(0)
            let meta = link.getElementsByClassName("md-hiden md-link-url md-meta").item(0)
            if(!a || !meta) return
            a.href = meta.textContent?meta.textContent:a.href
        })
    }

    /**
     * 刷新上下文中的图片节点
     */
    refreshImg(){
        let root = this.ir.rootElement
        let imgs = root.querySelectorAll(Constants.SELECTOR_MD_INLINE_IMG)
        
        imgs.forEach(img=>{
            let url = img.getElementsByClassName("md-img-url md-hiden md-meta").item(0)
            let i = img.getElementsByTagName("img").item(0)
            if(!url || !i) return
            i.src = url.textContent?url.textContent:i.src
        })
    }

    /**
     * 刷新上下文中的标题节点
     */
    refreshHeading(){


    }

    /**
     * 刷新上下文中的TOC节点
     */
    refreshToc(){
        let root = this.ir.rootElement
        let toc = root.querySelector(".markdown-it-toc-beautiful[md-block]")
        if(!toc) return
        let as = toc.querySelectorAll("a")
        as.forEach(a=>{
            let href = a.getAttribute("to-href")
            let id = "#"+href
            let heading = root.querySelector(id)
            if(heading) a.innerText = heading.textContent
            
        })
    }
}

export default IRContextRefresher