import YaLiEditor from '..'
import { findClosestByAttribute,findClosestByClassName,findClosestByTop, findClosestMdBlock} from "../util/findElement";
import Constants from "../constants";
import {toKeyText} from "../util/formatText"
import rangy from "rangy";

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
            "ctrl+shift+k": this.codeblockKey,
            "ctrl+shift+~": this.codelineKey,
            "ctrl+shift+`": this.codelineKey,
            "ctrl+shift+%": this.deletelineKey,
            "ctrl+shift+5": this.deletelineKey
        }
    }

    /**
     * 撤销操作
     * @param event 
     */
    undoKey(event: KeyboardEvent){
        console.log("触发undo快捷键");
        const r = rangy.getSelection().getRangeAt(0)
        let start:HTMLElement|Node|null = r.startContainer
        if(start.nodeType === 3){
            start = start.parentElement;
        }
        let e = start as HTMLElement
        //来自代码的不处理
        if(e.classList.contains(Constants.CODEMIRROR_LINE)){
            return
        }
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
            console.log(str);
            
            const res = this.editor.ir.renderer.render(str)
            console.log(res);
            const div = document.createElement("div")
            div.innerHTML = res
            
            content.replaceChildren(div.firstElementChild.firstElementChild)
            r.insertNode(content)
            sel.setSingleRange(r);
        }
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