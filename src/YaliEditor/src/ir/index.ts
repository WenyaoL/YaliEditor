import MarkdownBeautiful from "../../../markdown-it-plugin";
import YaLiEditor from "..";
import CommonEventBinder from "../eventbinder/commonEventBinder";
import MarkdownIt from "markdown-it/lib";
import { BaseEventBinder } from "../../types";
import TurndownService from "turndown";
import turndown from '../../../turndown-plugin'
import IRHotkeyBinder from "../eventbinder/IRHotkeyBinder";
import IRSelectBinder from "../eventbinder/IRSelectBinder";
import IRInputBinder from "../eventbinder/IRInputBinder";
import IRUndo from "./IRUndo";
import IRHotkeyCanUndoBinder from "../eventbinder/IRHotkeyCanUndoBinder";
import { Command, IRUndoManager } from "./IRUndoManager";
import IRInputCanUndoBinder from "../eventbinder/IRInputCanUndoBinder";


class IR{

    public editor:YaLiEditor;
    public renderer:MarkdownBeautiful;
    public parser:TurndownService
    public rootElement:HTMLElement;

    public binderList:BaseEventBinder[];

    //public undo:IRUndo
    public undoManager:IRUndoManager

    constructor(editor:YaLiEditor){
        this.editor = editor;
        const divElement = document.createElement("div");
        divElement.className = "YaLi-ir";
        divElement.setAttribute("contenteditable","true");
        divElement.setAttribute("tabindex","1");
        this.editor.rootElement.appendChild(divElement);
        this.rootElement = divElement;

        this.renderer = new MarkdownBeautiful();
        this.parser = turndown;
        //this.undo = new IRUndo();
        this.undoManager = new IRUndoManager();
        this.binderList = [];
        this.binderList.push(new CommonEventBinder());
        this.binderList.push(new IRHotkeyCanUndoBinder(this.editor))
        //this.binderList.push(new IRInputBinder(this.editor))
        this.binderList.push(new IRInputCanUndoBinder(this.editor))
        //this.binderList.push(new IRHotkeyBinder(this.editor));
        this.binderList.push(new IRSelectBinder(this.editor));

        this.bindEvent(this.rootElement);
    }

    public undo(){
        this.undoManager.undo()
    }

    public redo(){
        this.undoManager.redo()
    }

    public execute(command:Command,...args:any[]){
        this.undoManager.execute(command,...args)
    }
    /**
     * bind all event
     * @param element 
     */
    private bindEvent(element:HTMLElement){
        
        
        this.binderList.forEach(binder=>{
            binder.bindEvent(element);
        })

        this.renderer.codemirrorManager.addViewUpdateListener((update)=>{
            if (update.docChanged && update.state.doc.length >0 && update.view.dom.hasAttribute("ready-destroy")) {
                update.view.dom.removeAttribute("ready-destroy")
            }
        })

    }
    /**
     * render markdown
     * 渲染markdown
     * @param src render markdown string
     */
    public render(src:string){
        const res = this.renderer.md.render(src)
        this.rootElement.innerHTML = res
        this.renderer.initEditorView(this.rootElement)
    }

    public getRootElementClassName(){
        return this.rootElement.className
    }
}

export default IR;