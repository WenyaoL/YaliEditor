/**
 * @author liangwenyao
 * @since 2022/8/8
 */
import {EditorState,type Extension, Compartment,StateEffect} from "@codemirror/state"
import {EditorView, keymap,ViewUpdate} from "@codemirror/view"
import {indentWithTab} from "@codemirror/commands"
import {basicSetup,minimalSetup} from "codemirror"
import {languages} from "@codemirror/language-data"
import {LanguageDescription} from "@codemirror/language"
import { javascript } from '@codemirror/lang-javascript'
import {CodemirrorEditorState} from './CodemirrorEditorState'
import {CodemirrorEditorView} from './CodemirrorEditorView'
import {mount} from './SearchInputComponent'
import { v4 as uuidv4 } from 'uuid';
import {noLineNumberBasicSetup,gutterBasicSetup,myHistorySetup} from '@/codemirror-plugin/codeStyle/codePlugin';
import YaLiEditor from "@/YaliEditor/src";
import { myHistory } from "@/codemirror-plugin/codePlugin/history";
import { oneDark, oneDarkHighlightStyle,oneDarkTheme} from '@/codemirror-plugin/codeTheme/dark';
import {oneLight} from '@/codemirror-plugin/codeTheme/light';
import {langCanload} from './lang' 

/**
 * 创建一个compartment,并和对其修改的run函数
 * @param view 
 * @returns 
 */
 // https://codemirror.net/examples/config/
 // https://github.com/uiwjs/react-codemirror/blob/22cc81971a/src/useCodeMirror.ts#L144
 // https://gist.github.com/s-cork/e7104bace090702f6acbc3004228f2cb
export const createEditorCompartment = () => {
    const compartment = new Compartment()
    const run = (extension: Extension,view: EditorView) => {
        if(compartment.get(view.state)){   
            view.dispatch({ effects: compartment.reconfigure(extension) }) // reconfigure
        }else{
            view.dispatch({ effects: StateEffect.appendConfig.of(compartment.of(extension)) })// inject
        }
    }
    return { compartment, run }
}
 
/**
* 创建可以切换开关的Compartment，通过返回的函数来控制开关，如
* let switch = createEditorExtensionToggler(view,extension )
* switch(true) //开
* switch(false) //关
* @param view 
* @param extension 
* @returns 
*/
// https://codemirror.net/examples/reconfigure/
export const createEditorExtensionToggler = (view: EditorView, extension: Extension) => {
    const { compartment, run } = createEditorCompartment()
    return (targetApply?: boolean) => {
    const exExtension = compartment.get(view.state)
    const apply = targetApply ?? exExtension !== extension
    run(apply ? extension : [],view)
    }
}
 
export const selectTheme = (cache: CodemirrorEditorState,view:EditorView,type:string)=>{
    if(type == "light"){

        cache.themeCompartment.run(oneLight,view)
    }else{
        cache.themeCompartment.run(oneDark,view)
    }
}
 
export const loadLanguage = (lang:string)=>{
    if(!lang) return
    const languageDescription = LanguageDescription.matchLanguageName(languages, lang, true);
    if(!languageDescription) return null
    if(!languageDescription.support){
        languageDescription.load()
    }
    return languageDescription
}
 

export const createMathPlugin = ()=>{
    
}

 
 
 
 /**
  * codemirror管理器，
  * 用于管理页面内的codemirror editor
  */
export class CodemirrorManager{
    //编辑器
    public editor:YaLiEditor

    //codemirror编辑器面板
    private allStateCache:CodemirrorEditorState[] = [];
    //编辑器视图
    public allView :CodemirrorEditorView[] = [];
    //默认插件
    public codemirrorPlugin:Extension[];
    
    //每个视图都安装的监听器
    public viewlistener:(update: ViewUpdate)=>void;

    //语言包列表
    public langCanLoad:{}[];

    //theme type主题类型
    public themeType:string="light"

    //编辑器是否已经加载
    public isLoaded:boolean;
 
 
 
    constructor(editor:YaLiEditor){
        this.editor = editor
        
        //初始化默认插件
        this.codemirrorPlugin = this.editor.ir.options.codemirrorPlugins.concat([
            //customTheme,
            EditorView.lineWrapping,
            EditorView.updateListener.of((viewUpdate) => { // 默认自带的监听器
                
                if (viewUpdate.state.doc.length === 0) {
                    viewUpdate.view.dom.setAttribute("is-empty","true")
                }
                if (viewUpdate.state.doc.length > 0) {
                    viewUpdate.view.dom.setAttribute("is-empty","false")
                }
            })
        ])
        
        this.langCanLoad = langCanload
        
    }

    selectTheme(theme:string){
        
        
        this.themeType = theme
        this.allView.forEach(info=>{
            selectTheme(info.stateInfo,info.view,theme)
        })
    }
 
    addViewUpdateListener(listener:(update: ViewUpdate)=>void){
        this.viewlistener = listener
        //插入事件监听器
        this.codemirrorPlugin.push(EditorView.updateListener.of(this.viewlistener))
    }   
 
     /**
      * 添加一个视图，该视图将会被manager管理
      */
    addViewInfo(viewInfo:CodemirrorEditorView){
        this.allView.push(viewInfo)
    }
 
 
 
     
    addStateCache(src:CodemirrorEditorState){        
        this.allStateCache.push(src)
    }
    
    getStateCache(id:string){
        return this.allStateCache.find(codemirrorEditorState=>{
            return codemirrorEditorState.editor_uuid == id
        })
    }

    
    /**
     * 根据视图信息装载插件进入视图状态中
     * @param codemirrorEditorView 
     */
    loadCompartment(codemirrorEditorView:CodemirrorEditorView){
        let stateInfo =  codemirrorEditorView.stateInfo

        //装载langCompartment
        if(!stateInfo.langCompartment){
            stateInfo.langCompartment = createEditorCompartment()                
            if(stateInfo.languageDescription){
                stateInfo.langCompartment.run(stateInfo.languageDescription.support,codemirrorEditorView.view)
            }else {
                stateInfo.langCompartment.run([],codemirrorEditorView.view)
            }
        }

        //装载editorSwitch
        if(!stateInfo.editorSwitch){                
            //设置编辑状态按钮(默认打开)
            let sw = createEditorExtensionToggler(codemirrorEditorView.view,[
                    EditorView.editable.of(false),
                    EditorState.readOnly.of(true)
            ])
            stateInfo.editorSwitch = sw;
        }

        //编辑器主题
        if(!stateInfo.themeCompartment){
            stateInfo.themeCompartment = createEditorCompartment()
            selectTheme(stateInfo,codemirrorEditorView.view,this.themeType);
        }else{
            selectTheme(stateInfo,codemirrorEditorView.view,this.themeType)
        }


        //是否需要创建建议UI
        if(stateInfo.needSuggestUI){
            const tooltip = document.createElement("div")
            codemirrorEditorView.element.appendChild(tooltip)
            tooltip.classList.add("md-code-tooltip");
            //tooltip.classList.add("md-hiden")
            tooltip.setAttribute("spellcheck","false");
            //tooltip.setAttribute("editor-uuid",cache.editor_uuid)
            
            mount(tooltip,{
                codemirrorManager:this,
                editorId:stateInfo.editor_uuid,
                langName:stateInfo.lang
            })

        }


    }

 
    /**
     * refresh cache
     * 刷新缓存，通过缓存区的编辑器状态生成codemirror编辑器,并一一刷新到页面上
     * 并且会根据配置信息，装载格外的插件进状态中
     * 编辑器挂载的容器为页面上的空容器
     * @param elements 页面上的容器
     */
    refreshStateCache(elements:HTMLCollectionOf<Element>){

        this.allStateCache = this.allStateCache.filter(cache=>{

            //根据id识别到要挂载的容器
            const element:Element = elements.namedItem(cache.editor_uuid)
            

            if(!element){
                //this.allDisableView.push(new CodemirrorEditorView(null,null,cache))
                return true
            }

            
            let view = new EditorView({
                parent: element,
                root:document
            })
            view.setState(cache.state)
            
            //创建视图信息
            const viewInfo = new CodemirrorEditorView(element,view,cache)
            //更加信息装载Compartment
            this.loadCompartment(viewInfo)
            this.allView.push(viewInfo)

            

            return false
        })

    }
    


    /**
     * 从页面容器元素提取文本信息
     * 在原视图中提取插件信息
     * @param element 页面容器元素
     * @param codemirrorEditorView 原有视图信息
     */
    extractExiteViewInfo(element:Element,codemirrorEditorView:CodemirrorEditorView):CodemirrorEditorState{
        let id = codemirrorEditorView.stateInfo.editor_uuid,
            lang = '',
            needSuggestUI = true,
            codemirrorPlugin = this.codemirrorPlugin,
            languageDescription = null;
        //销毁原视图
        codemirrorEditorView.view.destroy()

        //语言包选择UI插件
        needSuggestUI = codemirrorEditorView.stateInfo.needSuggestUI
        if(!needSuggestUI){//没有加载包应该是数学块
            codemirrorPlugin = this.createMathPlugin(id)
        }

        //提取语言描述信息
        lang = codemirrorEditorView.stateInfo.lang
        languageDescription = loadLanguage(lang)

        //提取文本（页面上的文本）
        const text = this.extractElementPlainText(element)


        let startState = EditorState.create({
            doc: text,
            extensions:codemirrorPlugin
        })

        return new CodemirrorEditorState(id,startState,{
                                                languageDescription,
                                                needSuggestUI:needSuggestUI,
                                                lang})

        
    }

    /**
     * 从元素中提取编辑器的文本信息
     * @param element 
     * @returns 
     */
    extractElementTextInfo(element:Element){

        let lineArr = []
        const lines = element.getElementsByClassName("cm-line")
        if(lines.length == 0) return ''
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index].textContent;
            lineArr.push(line)
        }
        return lineArr.join("\n")
    }

    extractElementPlainText(element:Element){
        return element.textContent
    }

    /**
     * 从元素中尽可能地提取编辑器的基础信息
     * @param element 
     */
    extractElementInfo(element:Element){
        //提取文本信息
        let text = this.extractElementTextInfo(element),
            needSuggestUI = true;

        //更加是否有输入框确定是否需要加载语言包
        let input = element.getElementsByTagName("input").item(0)
        if(!input) needSuggestUI = false
        
        


    }

    createMathPlugin(id:string){
        return this.codemirrorPlugin.concat([EditorView.updateListener.of(viewupdate=>{
            if (viewupdate.state.doc.length === 0) {
                viewupdate.view.dom.setAttribute("is-empty","true")
            }
            if (viewupdate.state.doc.length > 0) {
                viewupdate.view.dom.setAttribute("is-empty","false")
            }
            if(viewupdate.docChanged){
              this.editor.ir.observer.ignore(()=>{
                this.editor.ir.renderer.mathjax.freshMathjax(id,viewupdate.state.doc.toString())
              },this.editor.ir.renderer.mathjax)
            }
          })])
    }

    /**
     * 对页面的所有视图进行销毁，将其编辑器状态重新放回缓存区
     * 重新刷新缓存区，重新渲染codemirror编辑器面板
     * 
     * 从页面中提取编辑器的文本信息，在根据原有视图的信息，整合成新的编辑器状态，并放入缓存区
     * 
     * @param root 
     */
    refreshEditorViewSyn(root?:HTMLElement){
        if(!root) root = this.editor.ir.rootElement
        
        const elements = root.getElementsByClassName("markdown-it-code-beautiful")
        
        

        for (let index = 0; index < elements.length; index++) {
            let stateCache = null;

            const element = elements[index];
            //找到现存的视图的ID
            const idx = this.allView.findIndex(viewInfo=>viewInfo.stateInfo.editor_uuid === element.id)
            if(idx>=0){//存在匹配到的现存视图
                //提取信息
                stateCache = this.extractExiteViewInfo(element,this.allView[idx])

                
            }else{//无法匹配到现存视图
                let cache = this.getStateCache(element.id)
                
                if(cache) continue;
                let text = this.extractElementTextInfo(element)

            }
            
            
            //将数据重新放入缓存
            this.allStateCache.push(stateCache)
            element.innerHTML=""
        }
        //重新置空
        delete this.allView
        this.allView = []

        this.refreshStateCache(elements)

    }
     
 
 
    /**
     * 重新跟新视图状态
     */
    refreshEditorView(root:HTMLElement){
        
        setTimeout(() => {
            this.refreshEditorViewSyn(root)
        })
    }

    /**
     * 同步的方式初始化编辑器
     * 初始化codemirror编辑器，其实是去刷新状态缓存池
     * 注意：请确保语言包已经加载完成，否则有可以导致某些编辑模块无法使用语言包
     * @param root 
     */
    initEditorViewSyn(root:HTMLElement){
        const elements = root.getElementsByClassName("markdown-it-code-beautiful")
        //刷新状态缓存池
        this.refreshStateCache(elements);
        
        if(this.editor.ir.options.disableEdit){
            this.disableEditAllView()
        }
    }

    /**
     * init Editor
     * @param root 
     */
    initEditorView(root:HTMLElement){
        //将刷新事件加入事件列表，因为要等列表前面的语言包加载事件执行完，才能刷新
        return new Promise((resolve,reject)=>{
        setTimeout(() => {
            this.initEditorViewSyn(root)
            resolve("")
        });
        })
        
    }

    /**
     * 删除指定下标的视图编辑器
     */
    viewDestroy(uuid:string){
        if(this.allView.length <=0) return ;
        const idx = this.allView.map(view=>view.stateInfo.editor_uuid).indexOf(uuid)
        if(idx==-1) return
        const viewInfo =  this.allView.at(idx);
        viewInfo.view.destroy()
        this.allView.splice(idx,1)
    }

    viewDisable(uuid:string){
        if(this.allView.length <=0) return ;
        const idx = this.allView.map(view=>view.stateInfo.editor_uuid).indexOf(uuid)
        if(idx==-1) return
        const viewInfo = this.allView.splice(idx, 1).at(0)
        //跟新视图状态
        viewInfo.stateInfo.state = viewInfo.view.state
        //重新返回缓存(等待刷新)
        this.allStateCache.push(viewInfo.stateInfo)
    }

    viewFocus(uuid:string){
        
        if(this.allView.length<=0) return;

        
        const idx = this.allView.map(viewInfo=>viewInfo.stateInfo.editor_uuid).indexOf(uuid)

        
        if(idx==-1) return
        let view = this.allView.at(idx).view
        this.editor.ir.focueProcessor.updateFocusElementByStart(view.dom)
        view.focus()
    }

    disableEditAllView(){
        this.allView.forEach(viewInof=>{
            //关闭可编辑     
            viewInof.stateInfo.editorSwitch(true)
        })
    }

    updatedLang(lang:string,uuid:string){
        
        const languageDescriptions = LanguageDescription.matchLanguageName(languages, lang, true);
        if(!languageDescriptions){
            return
        }
        //是否已经加载
        const support = languageDescriptions.support

        const idx = this.allView.map(view=>view.stateInfo.editor_uuid).indexOf(uuid)
        const viewInfo = this.allView[idx];
        const stateInfo = viewInfo.stateInfo
        stateInfo.lang = lang
        if(support){//已经加载
            //跟新语言包
            stateInfo.langCompartment.run(support,viewInfo.view)
            
        }else{//去加载并跟新
            languageDescriptions.load().then(s=>{
                stateInfo.langCompartment.run(s,viewInfo.view)
            })
        }

    }

    getViewInfo(uuid:string){
        const idx = this.allView.map(viewInfo=>viewInfo.stateInfo.editor_uuid).indexOf(uuid)
        if(idx>=0){
            return this.allView.at(idx)
        }
        return null
    }

    /**
     * 获取指定id的文本信息
     * @param uuid 
     */
    getTextValue(uuid:string){
        const viewInfo = this.getViewInfo(uuid)
        
        if(viewInfo){
            let res = viewInfo.view.state.doc.toString()
            return res;
        }else{
            return ''
        }
            
    }

    /**
     * 给markdown-it的高亮器插件，使得markdown-it能使用codemirror作为代码编辑器
     * 经过markdown-it高亮器插件处理的代码块，将会以codemirror代码编辑器状态（CodemirrorEditorState）存储在缓存区里
     * 只有通过刷新缓存区的状态，才能将视图渲染到页面
     * 
     * highlighter只会创建代码块的容器（pre），并不会创建代码块
     * @param str 
     * @param lang 
     * @returns 
     */
    highlighter = (str:string,lang:string)=>{
        //创建容器
        const pre = document.createElement("pre")
        pre.classList.add("markdown-it-code-beautiful")
        pre.setAttribute("md-block","fence")
        pre.setAttribute("contenteditable","false");
        const uuid = uuidv4()
        pre.id = uuid


        if(str.endsWith("\n")){
            str = str.substring(0,str.length-1)
        }

        //加载语言包
        let languageDescription = loadLanguage(lang)
        let startState = EditorState.create({
            doc: str,
            extensions:this.codemirrorPlugin
        })

        let info =  new CodemirrorEditorState(uuid,startState,{
                                                languageDescription,
                                                needSuggestUI:true,
                                                lang})
        this.allStateCache.push(info)
        return pre.outerHTML
    }
}
 
 
// 引入个性化的vs2015样式
//import 'highlight.js/styles/vs2015.css'

export default CodemirrorManager;
 
 
 