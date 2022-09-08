import YaLiEditor from "..";
import Constants from "../constants"
import rangy from "rangy";
import { findClosestByAttribute, findClosestByTop } from "../util/findElement";

/**
 * IR模式下的Undo redo功能提供管理器
 * 将执行操作抽象成一条条Command，实际操作使用的是document.execCommand
 * 将一系列的document.execCommand操作封装在一个命令Command接口类中
 * 根据用户的操作执行对应的命令，并将命令加入undo压栈中
 * 当用户执行undo操作时，将栈中命令弹出并执行该Command的undo方法，对操作进行undo
 * 直接undo使用的是document.execCommand("undo")
 * 
 * 
 * 注意：本类已经弃用，因为document.execCommand执行的操作与浏览器自身的有关，
 * 不同的浏览器有不同的操作。并且document.execCommand执行的操作难以预测，
 * 为了对这些操作进行统一，需要大量的浏览器行为修正的代码，不利于维护，所有选择弃用该模块。
 * 
 * 
 */
export interface Command{
    //命令的名称
    name:string;
    //execute
    execute(...args:any[]):any;
    //undo
    undo():void;
    //redo
    redo():void;
}

/**
 * md-inline级删除命令
 */
export class DeleteInlineCommand implements Command{
    name: string;
    editor:YaLiEditor;
    executeNum:number = 3;
    constructor(editor:YaLiEditor){
        this.name = "DeleteInlineCommand"
        this.editor = editor;
    }
    execute(element:HTMLElement,r:RangyRange): void {

        document.execCommand("delete")

        
        if(!element) return ;
        const turndown = this.editor.ir.parser.turndown(element.outerHTML)
        const res = this.editor.ir.renderer.render(turndown)
        
        if(!res) return ;
        //临时div
        const div = document.createElement("div")
        div.innerHTML = res;
        
        if(div.firstElementChild.hasAttribute(Constants.ATTR_MD_INLINE)){
            //翻译出的是MD_INLINE块
            //删除原本整个MD_INLINE块
            r.selectNode(element)
            rangy.getSelection().setSingleRange(r)
            document.execCommand("delete")
            //在插入
            document.execCommand("insertHTML",false,res)
        }
        if(div.firstElementChild.hasAttribute(Constants.ATTR_MD_BLOCK)){
            //翻译出的是MD_BLOCK块
            //删除原本整个MD_INLINE块
            r.selectNode(element)
            rangy.getSelection().setSingleRange(r)
            document.execCommand("delete")
            //在插入文本节点
            document.execCommand("insertHTML",false,div.firstElementChild.textContent)
        }
    }
    undo(): void {
        document.execCommand("undo")
        document.execCommand("undo")
        document.execCommand("undo")
    }
    redo(): void {
        document.execCommand("redo")
        document.execCommand("redo")
        document.execCommand("redo")
    }


}

export class DeleteAnyInlineCommand implements Command{
    name: string;
    editor:YaLiEditor;
    executeNum:number = 3;
    constructor(editor:YaLiEditor){
        this.name = "DeleteInlineCommand"
        this.editor = editor;
    }
    execute(): void {
        document.execCommand("delete")
        let r = rangy.getSelection().getRangeAt(0)
        let block = findClosestByAttribute(r.startContainer,Constants.ATTR_MD_BLOCK,"",this.editor.ir.getRootElementClassName())
        r.selectNodeContents(block)
    }
    undo(): void {
        document.execCommand("undo")
    }
    redo(): void {
        document.execCommand("redo")
    }


}



/**
 * md-block级删除命令
 */
export class DeleteBlockCommand implements Command{
    name: string;
    editor:YaLiEditor;
    executeNum:number = 0;

    constructor(editor:YaLiEditor){
        this.editor = editor;
    }

    deleteElement(startElement:HTMLElement,r:RangyRange){
        if(!startElement) return ;
        console.log(startElement.outerHTML);
        let turndown = this.editor.ir.parser.turndown(startElement.outerHTML)
        let res = this.editor.ir.renderer.render(turndown)
        if(!res) return ;
        
        
        //临时div
        const div = document.createElement("div")
        div.innerHTML = res;
        
        if(div.firstElementChild.hasAttribute(Constants.ATTR_MD_INLINE)){
            //翻译出的是MD_INLINE块
            //删除原本整个MD_INLINE块
            r.selectNode(startElement)
            rangy.getSelection().setSingleRange(r)
            document.execCommand("delete")
            this.executeNum++
            //在插入
            document.execCommand("insertHTML",false,res)
            this.executeNum++
        }
        if(div.firstElementChild.hasAttribute(Constants.ATTR_MD_BLOCK)){
            //翻译出的是MD_BLOCK块
            //删除原本整个MD_INLINE块
            r.selectNode(startElement)
            rangy.getSelection().setSingleRange(r)
            document.execCommand("delete")
            this.executeNum++
            //在插入文本节点
            document.execCommand("insertHTML",false,div.firstElementChild.textContent)
            this.executeNum++
        }
    }

    execute(): void {
        
        document.execCommand("delete")
        this.executeNum++
        let r = rangy.getSelection().getRangeAt(0)
        //一般字体的删除
        
        let inline = findClosestByAttribute(r.startContainer,Constants.ATTR_MD_INLINE,"",this.editor.ir.getRootElementClassName())
        if(inline!=null && 
            (inline.getAttribute(Constants.ATTR_MD_INLINE) === "img" || 
            inline.getAttribute(Constants.ATTR_MD_INLINE) === "link")){
                let block = findClosestByAttribute(r.startContainer,Constants.ATTR_MD_BLOCK,"",this.editor.ir.getRootElementClassName())
                let turndown = this.editor.ir.parser.turndown(block.outerHTML)
                let res = this.editor.ir.renderer.render(turndown)
                r.selectNodeContents(block)
                
                rangy.getSelection().setSingleRange(r)
                document.execCommand("delete")
                this.executeNum++
                document.execCommand("insertHTML",false,res)
                this.executeNum++
        }

    }
    undo(): void {
        for (let index = 0; index < this.executeNum; index++) {
            document.execCommand("undo")
        }
    }
    redo(): void {
        for (let index = 0; index < this.executeNum; index++) {
            document.execCommand("redo")
        }
    }
}



/**
 * 纯文本删除命令
 */
export class DeleteTextCommand implements Command{
    name: string;
    editor:YaLiEditor;
    executeNum:number = 0;
    constructor(editor:YaLiEditor){
        this.name = "DeleteTextCommand"
        this.editor = editor;
    }

    execute() {
        document.execCommand("delete")
        this.executeNum++
        let r = rangy.getSelection().getRangeAt(0)
        let start =  r.startContainer as HTMLElement
        const mark = r.getBookmark()
        if(start.nodeType === 3){
            start = start.parentElement
        }
        if(start.classList.contains(Constants.CLASS_MD_META)){
            //元数据类更改，应该影响内容的展示和标签的实际功能
            let e = findClosestByAttribute(start,Constants.ATTR_MD_INLINE,"img",this.editor.ir.getRootElementClassName())
            if(e){
                const endOffset = r.endOffset

                //document.execCommand("insertHTML",false,img.outerHTML)
                //r.moveToBookmark(mark)
                //rangy.getSelection().setSingleRange(r)
                r.selectNodeContents(e.getElementsByTagName("IMG")[0])
                rangy.getSelection().setSingleRange(r)
                console.log(rangy.getSelection().getRangeAt(0));
                
                let turndown = this.editor.ir.parser.turndown(e.outerHTML)
                let res = this.editor.ir.renderer.render(turndown)
                //临时元素

                const div = document.createElement("div")
                div.innerHTML = res
                const img = div.getElementsByTagName("IMG")[0]
                document.execCommand("insertHTML",false,img.outerHTML)
                this.executeNum++
                r.selectNode(e.getElementsByTagName("IMG")[1])
                rangy.getSelection().setSingleRange(r)
                document.execCommand("insertText",false,"")
                this.executeNum++
                r.moveToBookmark(mark)
                rangy.getSelection().setSingleRange(r)

            }
            

            e = findClosestByAttribute(start,Constants.ATTR_MD_INLINE,"link",this.editor.ir.getRootElementClassName())
            if(e){
                e.getElementsByTagName("a")[0].href = start.innerText
            }
        }

    }
    undo(): void {
        for (let index = 0; index < this.executeNum; index++) {
            document.execCommand("undo")
        }
    }
    redo(): void {
        for (let index = 0; index < this.executeNum; index++) {
            document.execCommand("redo")
        }
    }

}

/**
 * 代码块级删除命令
 */
export class DeleteCodemirrorCommand implements Command{
    name: string;
    constructor(){
        this.name = "DeleteCodemirrorCommand"
    }
    execute() {
        document.execCommand("delete")
    }
    undo(): void {
        document.execCommand("undo")
    }
    redo(): void {
        document.execCommand("redo")
    }
}

/**
 * 回车键处理命令
 */
export class EnterCommand implements Command{
    name: string;
    editor:YaLiEditor;
    executeNum:number = 0;
    constructor(editor:YaLiEditor){
        this.editor = editor;
    }
    execute() {
        let r = rangy.getSelection().getRangeAt(0)
        let start =  r.startContainer
        let endOffset = r.endOffset
        let inline = findClosestByAttribute(start,Constants.ATTR_MD_INLINE,"",this.editor.ir.getRootElementClassName())

        if(!rangy.getSelection().isCollapsed){
            document.execCommand("insertParagraph",false)
            if(inline){
                
                //链接处理
                if(inline.getAttribute(Constants.ATTR_MD_INLINE) === "link"){
                    r = rangy.getSelection().getRangeAt(0)
                    start = r.startContainer

                    let block = findClosestByAttribute(start,Constants.ATTR_MD_BLOCK,"",this.editor.ir.getRootElementClassName())
                    r.collapseBefore(block)
                    r.setStart(r.startContainer,r.startOffset-1)
                    r.setEndAfter(block)
                    let newStartOffset = r.startOffset
                    rangy.getSelection().setSingleRange(r)
                    let turndown = this.editor.ir.parser.turndown(r.toHtml())
                    let res = this.editor.ir.renderer.render(turndown)
                    document.execCommand("delete")
                    //r.setStart(this.editor.ir.rootElement,newStartOffset-1)
                    
                    document.execCommand("insertHTML",false,res)

                }
                return
            }
            
        }else{

            if(inline){
                document.execCommand("insertParagraph",false)
            }
            const e = findClosestByAttribute(start,Constants.ATTR_MD_BLOCK,"",this.editor.ir.getRootElementClassName())
            
            
            if(e.tagName === "PRE"){
                //代码块不处理
                return;
            }
            //在p中插入<br>标签,rangy会无法选中,拿到的startContainer无法对应页面上的标签
            //这BUG发现,可以通过wbr来解决
            const wp = '<p md-block="paragraph"><wbr></p>'
            const p = '<p md-block="paragraph"><br></p>'
            if(r.endOffset === 0){  //开头插入
                if(e.tagName === "P"){
                    document.execCommand("insertParagraph",false)
                    return 
                }
                r.collapseBefore(e)
                rangy.getSelection().setSingleRange(r)
                document.execCommand("insertHTML",false,wp)
            }else if(start.textContent.length > endOffset){ //中间插入
                document.execCommand("insertParagraph",false)
            }else{ //结尾插入
                if(e.tagName === "P"){
                    document.execCommand("insertParagraph",false)
                    return 
                }
                r.collapseAfter(e)
                rangy.getSelection().setSingleRange(r)
                document.execCommand("insertHTML",false,wp)
            }
        }
        

        
        
    }
    undo(): void {
        for (let index = 0; index < this.executeNum; index++) {
            document.execCommand("undo")
        }
    }
    redo(): void {
        for (let index = 0; index < this.executeNum; index++) {
            document.execCommand("redo")
        }
    }
    
}


/**
 * 空命令
 */
export class EmptyCommand implements Command{
    name: string;
    execute() {}
    undo(): void {
        document.execCommand("undo")
    }
    redo(): void {
        document.execCommand("redo")
    }

}




export class IRUndoManager{

    undoStack:Command[];
    redoStack:Command[];


    constructor(){
        this.undoStack = [];
        this.redoStack = [];
    }

    execute(command:Command,...args:any[]){
        
        command.execute(...args)
        this.undoStack.push(command)
        this.redoStack = [];
    }
    undo(){
        const command = this.undoStack.pop()
        if(!command) return ;
        command.undo()
        this.redoStack.push(command);
    }
    redo(){
        const command = this.redoStack.pop()
        if (!command) return ; 
        command.redo()
        this.undoStack.push(command);
    }
}