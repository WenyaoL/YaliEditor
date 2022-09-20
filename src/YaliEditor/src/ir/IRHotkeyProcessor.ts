import YaLiEditor from '..'
import { findClosestByAttribute,
    findClosestByClassName,
    findClosestByTop, 
    findClosestMdBlock, 
    IRfindClosestParagraph,
    IRfindClosestLi, 
    IRfindClosestList} from "../util/findElement";

import { getAllHeading } from '../util/inspectElement';
import Constants from "../constants";
import {toKeyText} from "../util/formatText"
import rangy from "rangy";
import IR from '.';
import { divide } from 'lodash';


class HotkeyProcessor{
    //编辑器
    public editor:YaLiEditor;
    //快捷键映射表
    public defaultKeyMap:Object;


    constructor(editor:YaLiEditor){
        this.editor = editor
        this.defaultKeyMap = {
            "ctrl+1": this.headingKey,
            "ctrl+2": this.headingKey,
            "ctrl+3": this.headingKey,
            "ctrl+4": this.headingKey,
            "ctrl+5": this.headingKey,
            "ctrl+6": this.headingKey,
            "ctrl+z": this.undoKey,
            "ctrl+b": this.blodKey,
            "ctrl+[": this.reduceIndentKey,
            "ctrl+]": this.addIndentKey,
            "ctrl+shift+k": this.codeblockKey,
            "ctrl+shift+q": this.quoteKey,
            "ctrl+shift+~": this.codelineKey,
            "ctrl+shift+`": this.codelineKey,
            "ctrl+shift+%": this.deletelineKey,
            "ctrl+shift+5": this.deletelineKey,
            "ctrl+shift+{":this.listKey,
            "ctrl+shift+}":this.unlistKey,
            "ctrl+shift+t":this.tocKey
        }
    }

    /**
     * 撤销操作
     * @param event 
     */
    undoKey(event: KeyboardEvent){
        const r = rangy.getSelection().getRangeAt(0)
        let start:HTMLElement|Node|null = r.startContainer
        if(start.nodeType === 3){
            start = start.parentElement;
        }
        let e = start as HTMLElement
        //来自代码的不处理
        /*if(e.classList.contains(Constants.CODEMIRROR_LINE)){
            return
        }*/
        this.editor.ir.undo()
    }
    
    /**
     * 标题快捷键
     * @param event 
     */
    headingKey(event: KeyboardEvent){
           
        const r = rangy.getSelection().getRangeAt(0)
        
        const start =  r.startContainer

        let e = findClosestByAttribute(start,"md-block","",this.editor.ir.getRootElementClassName())

        if(!e){
            e = findClosestByTop(start,this.editor.ir.getRootElementClassName())
        }   
        
        if(!e) return

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
                const node = div.firstElementChild as HTMLElement

                if(!text || text == "\n" || text.length == 0) node.innerHTML = "<br>"

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
            const node = div.firstElementChild as HTMLElement
            if(!turndown) node.innerHTML = "<br>"
            //删除
            r.selectNode(e)
            r.deleteContents()
            //插入新的

            r.insertNode(node)
            r.collapseToPoint(node,1)
            rangy.getSelection().setSingleRange(r)
            //rangy.getSelection().collapseToEnd()
            node.click()
        }
    }

    /**
     * 代码块快捷键
     */
    codeblockKey(event: KeyboardEvent){
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        const start =  r.startContainer

        let e = findClosestMdBlock(start)
        if(!e) return
        let content:DocumentFragment,
            uuid:string;
        //光标聚合的
        if(r.collapsed){
            r.setEndAfter(e)
            //剪切
            content = r.extractContents()

            let block = content.firstElementChild
            if(!block) return
            //创建codemirror编辑面板
            const codeStr = "```\n\n```"
            const res = this.editor.ir.renderer.render(codeStr)
            //添加面板
            block.insertAdjacentHTML("beforebegin",res)
            if(!block.textContent || block.textContent.length == 0) content.removeChild(block)
            uuid = content.firstElementChild? content.firstElementChild.id:''

            r.collapseAfter(e)
            r.insertNode(content)
            r.collapseAfter(e);
            sel.setSingleRange(r);

        }else{
            let str = r.extractContents().textContent
            r.setEndAfter(e)
            content = r.extractContents()
            
            let block = content.firstElementChild
            if(!block) return
            //创建codemirror编辑面板
            const codeStr = "```\n"+ str +"\n```"
            const res = this.editor.ir.renderer.render(codeStr)
            //添加面板
            block.insertAdjacentHTML("beforebegin",res)
            if(!block.textContent || block.textContent.length == 0) content.removeChild(block)
            uuid = content.firstElementChild? content.firstElementChild.id:''
            
            r.collapseAfter(e)
            r.insertNode(content)

            r.collapseAfter(e);
            sel.setSingleRange(r);
        }
        
        
        this.editor.ir.renderer.refreshStateCache(this.editor.ir.rootElement)
        this.editor.ir.renderer.codemirrorManager.viewFocus(uuid)
    }

    /**
     * 标题生成 markdown-it-toc-beautiful
     * @param event 
     */
    tocKey(event: KeyboardEvent){

        
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        const start =  r.startContainer

        const top = findClosestByTop(start,this.editor.ir.getRootElementClassName())
        if(!top) return
        r.collapseBefore(top)
        const root = this.editor.ir.rootElement
        
        //构建toc
        let res:string[] = []
        let svg = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa=""><path fill="currentColor" d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V256zm448-64v-64H416v64h192zM224 896h576V256H224v640zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32zm192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32z"></path></svg>'
        //svg = '<i class="el-icon-delete"></i>'
        let tip ='<div class="md-toc-tip md-hiden">'+'<span>目录</span><button class="toc-delete" onclick="TOC_DELETE()"><span>'+svg+'</button></span></div>';
        res.push(tip)
        
        res.push("<p>")
        const headings = getAllHeading(root)
        for (let index = 0; index < headings.length; index++) {
            const element = headings[index];
            let head = '<span class="md-toc-h'+ element.level +' md-toc-item ">' + '<a to-href="'+element.id+'">'+ element.content+'</a></span>'
            res.push(head)
        }
        res.push("</p>")

        let div = document.createElement("div")
        div.innerHTML = res.join("")
        div.className = "markdown-it-toc-beautiful"
        div.setAttribute(Constants.ATTR_MD_BLOCK,Constants.ATTR_MD_BLOCK_TOC)
        div.contentEditable = "false"

        r.insertNode(div)
        
    }

    /**
     * 小代码块快捷键
     * @param event 
     */
    codelineKey(event: KeyboardEvent){
        this.blockKey(event,"`","`")
    }

    /**
     * 
     * @param event 
     */
    deletelineKey(event: KeyboardEvent){
        this.blockKey(event,"~~","~~")
    }

    blodKey(event: KeyboardEvent){
        this.blockKey(event,"**","**")
        
    }


    blockKey(event: KeyboardEvent,pre:string,suf:string){
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        const start =  r.startContainer

        let e = findClosestMdBlock(start)
        if(!e) return
        let content:DocumentFragment;

        if(!r.collapsed){
            content = r.extractContents()
            let str = content.textContent
            str = pre+str+suf
            const res = this.editor.ir.renderer.render(str)
            const div = document.createElement("div")
            div.innerHTML = res
            
            content.replaceChildren(div.firstElementChild.firstElementChild)
            r.insertNode(content)
            sel.setSingleRange(r);
        }
    }

    /**
     * 添加缩进
     * @param event 
     */
    addIndentKey(event: KeyboardEvent){
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        const start =  r.startContainer

        let li = IRfindClosestLi(start)
        if(!li) return
        let list = IRfindClosestList(li)
        //是否有前兄弟节点
        if(li.previousElementSibling){
            let sibling = li.previousElementSibling
            let siblingChild:HTMLElement|null = sibling.getElementsByTagName("ol").item(0)
            if(!siblingChild) siblingChild = sibling.getElementsByTagName("ul").item(0)



            //根据兄弟节点是否有儿子进行决策
            if(!siblingChild){//兄弟节点没有儿子列表
                //给兄弟节点创建儿子
                siblingChild = document.createElement(list.tagName.toLowerCase())
                sibling.appendChild(siblingChild)
            }

            //判断当前节点是否有儿子节点
            let liChild:HTMLElement|null = li.getElementsByTagName("ol").item(0)
            if(!liChild) liChild = li.getElementsByTagName("ul").item(0)

            const bookmark = sel.getBookmark(li)
            if(liChild){//当前节点有儿子节点
                siblingChild.appendChild(li)
                for (let index = 0; index < liChild.childElementCount; index++) {
                    const element = liChild.children.item(index)
                    siblingChild.appendChild(element)
                }
                liChild.remove()
                sel.moveToBookmark(bookmark)
            }else{//当前节点没有儿子节点
                siblingChild.appendChild(li)
                sel.moveToBookmark(bookmark)
            }

        }
        
    }

    /**
     * 减少缩进
     * @param event 
     */
    reduceIndentKey(event: KeyboardEvent){
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        const start =  r.startContainer
        
        let li = IRfindClosestLi(start)
        if(!li) return
        let list = IRfindClosestList(li)
        //是否有上级列表
        if(list?.parentElement?.tagName === "LI"){
            let parentLi =  list.parentElement
            
            //判断是否有儿子节点
            let liChild:HTMLElement|null = li.getElementsByTagName("ol").item(0)
            if(!liChild) liChild = li.getElementsByTagName("ul").item(0)
            //没有儿子并且有下兄弟节点
            if(!liChild && li.nextElementSibling){
                //创建儿子
                liChild = document.createElement(list.tagName.toLowerCase())
                li.appendChild(liChild)
            }

            //兄弟节点变儿子节点
            let sibling = li.nextElementSibling
            while(sibling){
                liChild?.appendChild(sibling)
                sibling = li.nextElementSibling
            } 
            let bookmark = sel.getBookmark(li)
            parentLi.insertAdjacentElement("afterend",li)

            if(list.children.length === 0) list.remove()
            sel.moveToBookmark(bookmark)
        }
        
    }

    /**
     * 有序列表快捷键
     * @param event 
     */
    listKey(event: KeyboardEvent){
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        const start =  r.startContainer

        let p = IRfindClosestParagraph(start)
        if(!p) return 
        //重新渲染该节点
        let turndown = this.editor.ir.parser.turndown(p)
        turndown = "1. " + turndown;
        
        let res = this.editor.ir.renderer.render(turndown)
        const div = document.createElement("div")
        div.innerHTML = res
        r.selectNode(p)
        r.deleteContents()
        
        r.insertNode(div.firstElementChild)
    }

    /**
     * 无序列表快捷键
     * @param event 
     */
    unlistKey(event: KeyboardEvent){
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        const start =  r.startContainer
        const end = r.endContainer

        //判断是否已经是li
        IRfindClosestLi(start)


        let startP = IRfindClosestParagraph(start)
        let endP = IRfindClosestParagraph(end)

        r.setStartBefore(startP)
        r.setEndAfter(endP)

        let content =r.extractContents()
        
        let div = document.createElement("div")
        div.appendChild(content)

        //重新渲染该节点
        let turndown = this.editor.ir.parser.turndown(div.innerHTML)
        
        //切割行
        let split = turndown.split("\n")
        
        split = split.map(row=>{
            if(row.length==0) return row
            return "* " + row
        })
        
        turndown = split.join("\n")

        
        let res = this.editor.ir.renderer.render(turndown)
        div.innerHTML = res
        
        r.deleteContents()
        r.insertNode(div.firstElementChild)
    }

    /**
     * 引用快捷键
     * @param event 
     */
    quoteKey(event: KeyboardEvent){
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0).cloneRange() as RangyRange
        const start =  r.startContainer
        const end = r.endContainer

        //判断是否对li进行引用
        let li = IRfindClosestLi(start)
        if(li){
            r.setStart(li,0)
            r.setEndAfter(li.lastElementChild)
            let content = r.extractContents()
    
            let quote = document.createElement("blockquote")
            quote.appendChild(content)
            r.insertNode(quote)
            return
        }

        let startE = findClosestMdBlock(start)
        let endE = findClosestMdBlock(end)
        

        r.setStartBefore(startE)
        r.setEndAfter(endE)
        let content = r.extractContents()
    
        let quote = document.createElement("blockquote")
        quote.appendChild(content)
        r.insertNode(quote)
        
    }

    execute(event: KeyboardEvent){
        const k = toKeyText(event)
        console.log(k);
        
        const f:Function =  this.defaultKeyMap[k]
        if(f){
            f.call(this,event)
            this.editor.ir.undoManager.updateBookmark()
            event.preventDefault()
        }
    }
}

export default HotkeyProcessor;