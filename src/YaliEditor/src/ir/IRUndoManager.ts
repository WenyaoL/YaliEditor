import YaLiEditor from "..";
import Constants from "../constants"
import rangy from "rangy";


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

    execute(startElement:HTMLElement,endElement:HTMLElement,r:RangyRange): void {
        
        document.execCommand("delete")
        this.executeNum++
        this.deleteElement(startElement,r);
        r.setEnd(endElement,0);
        this.deleteElement(endElement,r);

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

    constructor(){
        this.name = "DeleteTextCommand"
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


export class EnterCommand{

}



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