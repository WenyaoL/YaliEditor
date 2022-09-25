/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */


import MarkdownBeautiful from "../../../markdown-it-plugin";
import YaLiEditor from "..";
import { BaseEventBinder, IROptions } from "../../types";
import HotkeyProcessor from './IRHotkeyProcessor'
import DeletekeyProcessor from './IRDeletekeyProcessor'
import IREnterkeyProcessor from './IREnterkeyProcessor'

import IRHotkeyBinder from "../eventbinder/IRHotkeyBinder";
import IRSelectBinder from "../eventbinder/IRSelectBinder";
import IRInputBinder from "../eventbinder/IRInputBinder";
import IRUndo from "../undo/IRUndo";

import TurndownParser from "../../../turndown-plugin";
import { DOMObserver } from "../state/domobserver";
import IRDeletekeyProcessor from "./IRDeletekeyProcessor";
import IRDragBinder from '../eventbinder/IRDragBinder'
import IRFocusProcessor from "./IRFocusProcessor";

import rangy from "rangy";
/**
 * IR模式下的控制面板
 */
class IR{
    //编辑器
    public editor:YaLiEditor;
    //IR面板的设置
    public options:IROptions

    //渲染器
    public renderer:MarkdownBeautiful;
    //解析器
    public parser:TurndownParser;
    //IR面板挂载的dom
    public rootElement:HTMLElement;
    //事件binder列表
    public binderList:BaseEventBinder[];
    //public undoManager:IRUndoManager
    //undo redo 管理器
    public undoManager:IRUndo
    //dom元素观察器
    public observer:DOMObserver;
    //快捷键处理器
    public hotkeyProcessor:HotkeyProcessor;
    //删除键处理器
    public deletekeyProcessor:IRDeletekeyProcessor
    //回车键处理器
    public enterkeyProcessor:IREnterkeyProcessor
    //光标选中处理器
    public focueProcessor:IRFocusProcessor


    constructor(editor:YaLiEditor){
        this.editor = editor;
        this.options = this.editor.options.ir
    }

    public init(){
        const divElement = document.createElement("div");
        divElement.className = "YaLi-ir";
        divElement.setAttribute("contenteditable","true");
        divElement.setAttribute("spellcheck","false")
        divElement.setAttribute("tabindex","1");
        this.editor.rootElement.appendChild(divElement);
        this.rootElement = divElement;

        this.renderer = new MarkdownBeautiful(this.editor);
        this.parser = new TurndownParser(this.editor);
        //this.undo = new IRUndo();
        //this.undoManager = new IRUndoManager();
        this.undoManager = new IRUndo(this.editor,"")
        this.hotkeyProcessor = new HotkeyProcessor(this.editor)
        this.deletekeyProcessor = new IRDeletekeyProcessor(this.editor)
        this.enterkeyProcessor = new IREnterkeyProcessor(this.editor)
        this.focueProcessor = new IRFocusProcessor(this.editor)
        this.binderList = [];
        //this.binderList.push(new CommonEventBinder());
        //this.binderList.push(new IRHotkeyCanUndoBinder(this.editor))
        //this.binderList.push(new IRInputCanUndoBinder(this.editor))
        this.binderList.push(new IRInputBinder(this.editor));
        this.binderList.push(new IRHotkeyBinder(this.editor));
        this.binderList.push(new IRSelectBinder(this.editor));
        this.binderList.push(new IRDragBinder(this.editor))
        this.bindEvent(this.rootElement);

        this.observer = new DOMObserver(this.rootElement,this.editor)

        
    }

    public undo(){
        //在undo期间屏蔽监控
        this.observer.ignore(this.undoManager.undo,this.undoManager)
    }

    public redo(){
        this.observer.ignore(this.undoManager.redo,this.undoManager)
    }


    public addUndo(){
        this.undoManager.addIRHistory()
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
     * load editor origin state
     * 渲染markdown
     * @param src render markdown string
     */
    public load(src:string){
        this.observer.stop()
        const res = this.renderer.render(src)
        if(res === ''){
            this.rootElement.innerHTML = '<p md-block="paragraph"><br></p>'
        }else{
            this.rootElement.innerHTML = res
        }
        this.undoManager.setOrigin(this.rootElement.innerHTML)
        this.renderer.initEditorView(this.rootElement)
        setTimeout(()=>{
            this.observer.start()
            this.focus()
            
        },1000)
    }

    /**
     * 获取markdown文本
     */
    public getMarkdown(){
       return this.parser.turndown(this.rootElement)
    }

    public getRootElementClassName(){
        return this.rootElement.className
    }

    public reRenderElement(element:Element) {
        let turndown = this.parser.turndown(element.outerHTML)
        return this.renderer.render(turndown)
    }

    public focus(){
        let e = this.rootElement.firstElementChild as HTMLElement
        window.getSelection().collapse(e,0)
        document.getSelection().collapse(e,0)
        rangy.getSelection().refresh()
        e.focus()
        
    }
}

export default IR;