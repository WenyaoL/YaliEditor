/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import YaLiEditor from "..";
import { BaseEventBinder} from "../../types";

//编辑器基础控件
import { DOMObserver } from "../state/domobserver";  //dom元素修改监控器
import IRUndo from "../undo/IRUndo";  //undo组件
//import IRUndo from "../undo/IRUndoSna"; //undo组件
import IRContextRefresher from './IRContextRefresher'  //上下文刷新
import ApplicationEventPublisher from '../event-publisher/ApplicationEventPublisher' //事件发布器
import IRState from "../state/IRState";

//翻译解析
import TurndownParser from "../plugin/turndown-plugin";
import MarkdownBeautiful from "../plugin/markdown-it-plugin";

//绑定器
import IRSelectBinder from "../eventbinder/IRSelectBinder";
import IRInputBinder from "../eventbinder/IRInputBinder";
import IRKeyBinder from "../eventbinder/IRKeyBinder";
import IRDragBinder from '../eventbinder/IRDragBinder'
//import IRScrollBinder from '../eventbinder/IRScrollBinder'

//处理器
import IRDeletekeyProcessor from "./IRDeletekeyProcessor";
import IRHotkeyProcessor from './IRHotkeyProcessor'
import IRFocusProcessor from "./IRFocusProcessor";
import IRArrowMoveKeyProcessor from './IRArrowMoveKeyProcessor'
import IREnterkeyProcessor from './IREnterkeyProcessor'
import IRInputProcessor from './IRInputProcessor'
import IRTabProcessor from './IRTabkeyProcessor'
import IRCopyProcessor from './IRCopyProcessor'
import IRPasteProcessor from './IRPasteProcessor'
import IRCompositionProcessor from './IRCompositionProcessor'
import IRClickProcessor from "./IRClickProcessor";


import rangy from "rangy";
import { getUniqueKey, refreshKeyId } from "../plugin/markdown-it-plugin/markdown-it-key-generator";
import IRPanelConfig from "../options/IRPanelConfig";
import IRDragProcessor from "./IRDragProcessor";
import { isMdBlockParagraph } from "../util/inspectElement";
import {createParagraph} from '../util/createElement'
/**
 * IR模式下的控制面板
 */
class IR {
    //编辑器
    public editor: YaLiEditor;
    //IR面板的设置
    public options: IRPanelConfig;

    //编辑面板是否已经被修改
    public isChange: boolean = false;
    //渲染器
    public renderer: MarkdownBeautiful;
    //解析器
    public parser: TurndownParser;
    //IR面板挂载的dom
    public rootElement: HTMLElement;
    //事件binder列表
    public binderList: BaseEventBinder[];
    //public undoManager:IRUndoManager
    //undo redo 管理器
    public undoManager: IRUndo
    //dom元素观察器
    public observer: DOMObserver;
    //快捷键处理器
    public hotkeyProcessor: IRHotkeyProcessor;
    //删除键处理器
    public deletekeyProcessor: IRDeletekeyProcessor
    //回车键处理器
    public enterkeyProcessor: IREnterkeyProcessor
    //键盘移动键处理器
    public arrowMoveKeyProcessor: IRArrowMoveKeyProcessor;
    //聚焦处理器
    public focueProcessor: IRFocusProcessor
    //点击处理器
    public clickProcessor: IRClickProcessor
    //输入处理器
    public inputProcessor: IRInputProcessor;
    //Tab键处理器
    public tabkeyProcessor: IRTabProcessor;
    //copy处理器
    public copyProcessor: IRCopyProcessor;
    //粘贴处理器
    public pasteProcessor: IRPasteProcessor;
    //拖拽处理器
    public dragProcessor: IRDragProcessor;
    //上下文刷新器
    public contextRefresher: IRContextRefresher;
    //打字处理器
    public compositionProcessor: IRCompositionProcessor;
    //事件发布器
    public applicationEventPublisher: ApplicationEventPublisher;
    //IR状态
    public state:IRState;


    constructor(editor: YaLiEditor) {
        this.editor = editor;
        this.options = this.editor.options.ir

        //将ir容器挂载到编辑器下面
        this.mount()
    }

    public mount() {
        const divElement = document.createElement("div");
        divElement.className = "YaLi-ir";

        if (!this.options.disableEdit) divElement.setAttribute("contenteditable", "true");
        divElement.setAttribute("spellcheck", "false")
        divElement.setAttribute("tabindex", "1");
        divElement.style.userSelect = "none;"
        this.editor.rootElement.appendChild(divElement);
        this.rootElement = divElement;
    }

    public init() {
        this.applicationEventPublisher = new ApplicationEventPublisher()
        this.state = new IRState(this.editor)

        this.renderer = new MarkdownBeautiful(this.editor);
        this.parser = new TurndownParser(this.editor);;

        this.undoManager = new IRUndo(this.editor, "")
        //this.undoManager = new IRUndo(this.editor, null)
        this.hotkeyProcessor = new IRHotkeyProcessor(this.editor)
        this.deletekeyProcessor = new IRDeletekeyProcessor(this.editor)
        this.enterkeyProcessor = new IREnterkeyProcessor(this.editor)
        this.focueProcessor = new IRFocusProcessor(this.editor)
        this.clickProcessor = new IRClickProcessor(this.editor)
        this.arrowMoveKeyProcessor = new IRArrowMoveKeyProcessor(this.editor)
        this.inputProcessor = new IRInputProcessor(this.editor)
        this.tabkeyProcessor = new IRTabProcessor(this.editor)
        this.copyProcessor = new IRCopyProcessor(this.editor)
        this.pasteProcessor = new IRPasteProcessor(this.editor)
        this.dragProcessor = new IRDragProcessor(this.editor)
        this.contextRefresher = new IRContextRefresher(this.editor)
        this.compositionProcessor = new IRCompositionProcessor(this.editor)

        this.binderList = [];
        this.binderList.push(new IRInputBinder(this.editor));
        this.binderList.push(new IRKeyBinder(this.editor));
        this.binderList.push(new IRSelectBinder(this.editor));
        this.binderList.push(new IRDragBinder(this.editor))
        //this.binderList.push(new IRScrollBinder(this.editor))
        this.bindEvent(this.rootElement);

        this.observer = new DOMObserver(this.rootElement, this.editor)

        if (this.options.disableEdit) this.observer.disableObserver()
        if (this.options.theme) {
            this.selectTheme(this.options.theme)
        }

        this.subscribe()
    }

    private subscribe() {
        this.contextRefresher.subscribe()
    }

    public reMount() {
        //更新挂载节点
        this.mount()
        //更新事件绑定的容器
        this.bindEvent(this.rootElement);
        //监听新的绑定容器
        this.observer = new DOMObserver(this.rootElement, this.editor)

        this.observer.stop()
        this.editor.ir.rootElement.innerHTML = this.undoManager.lastText
        this.editor.ir.renderer.refreshEditorView(this.editor.ir.rootElement);
        setTimeout(() => {
            this.observer.start()
            this.focus()
        }, 200)
    }

    public undo() {
        //在undo期间屏蔽监控
        this.undoManager.undo()

    }

    public redo() {
        this.undoManager.redo()
    }

    public addUndo() {
        this.undoManager.addIRHistory()
    }

    public selectTheme(theme: string) {
        this.renderer.setTheme(theme)
        this.options.theme = theme
    }


    /**
     * bind all event
     * @param element 
     */
    private bindEvent(element: HTMLElement) {
        this.binderList.forEach(binder => {
            binder.bindEvent(element);
        })

        this.renderer.codemirrorManager.addViewUpdateListener((update) => {
            if (update.docChanged && update.state.doc.length > 0 && update.view.dom.hasAttribute("ready-destroy")) {
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
    public load(src: string) {
        this.observer.stop()
        refreshKeyId()
        const res = this.renderer.render(src)
        if (res === '') {
            this.rootElement.innerHTML = `<p mid="${getUniqueKey()}" md-block="paragraph" class="md-focus"></p>`
        } else {
            this.rootElement.innerHTML = res
        }
        this.renderer.initEditorView(this.rootElement).then((info) => {
            let e = this.rootElement.cloneNode(true) as HTMLElement
            this.undoManager.setRootOrigin(e)
            //this.undoManager.setOrigin(this.rootElement.innerHTML)
        })
        this.contextRefresher.refreshContext()
        setTimeout(() => {
            if(isMdBlockParagraph(this.rootElement.lastElementChild)) this.rootElement.appendChild(createParagraph())
            this.observer.start()
            this.focus()
        }, 200)
    }

    /**
     * 获取markdown文本
     */
    public getMarkdown() {
        return this.parser.turndown(this.rootElement)
    }

    public getRootElementClassName() {
        return this.rootElement.className
    }

    public reRenderElement(element: Element) {
        let turndown = this.parser.turndown(element.outerHTML)
        return this.renderer.render(turndown)
    }

    public focus() {
        /*window.getSelection().removeAllRanges()
        const r = new Range()
        r.setStart(this.rootElement, 0)
        r.setEnd(this.rootElement, 0)
        window.getSelection().addRange(r)*/
        rangy.getSelection().refresh()
        this.rootElement.focus()
        if(this.rootElement.firstElementChild){
            (this.rootElement.firstElementChild as HTMLElement)?.focus()
        }
    }
}

export default IR;