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
import SearchSuggestUI from './ui'
import { v4 as uuidv4 } from 'uuid';
import {noLineNumberBasicSetup,gutterBasicSetup,myHistorySetup} from '@/codemirror-plugin/codeStyle/codePlugin'
import YaLiEditor from "@/YaliEditor/src"
import { myHistory } from "@/codemirror-plugin/codePlugin/history"

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

export interface EditorStateOptions{
    langCompartment?:{compartment:Compartment,run:(extension: Extension,view:EditorView) => void},
    lang?:string,
    needSuggestUI?:boolean,

    languageDescription?:LanguageDescription
}


/**
 * 封装的EditorState
 */
 export class CodemirrorEditorState implements EditorStateOptions{

    //uuid
    public editor_uuid : string;
    //codemirror编辑器初始化状态
    public state:EditorState;
    //codemirror盒子（能动态更改插件内容）
    public langCompartment:{compartment:Compartment,run:(extension: Extension,view:EditorView) => void};
    //当前客户指定使用的语言包名
    public lang:string='';
    //当前匹配到的语言描述信息
    public languageDescription:LanguageDescription;
    //是否需要创建建议UI
    public needSuggestUI:boolean=true;

    constructor(
        uuid:string,
        state:EditorState,
        options?:EditorStateOptions
    ){
        this.editor_uuid = uuid
        this.state = state;
        this.langCompartment = options.langCompartment;
        if(options.lang) this.lang = options.lang;
        this.needSuggestUI = options.needSuggestUI;
        this.languageDescription = options.languageDescription
    }

    /**
     * 创建一个简易的编辑器状态
     * @param id 
     * @param doc 
     */
    static of(id:string,doc:string,editor:YaLiEditor,extension?:Extension){
        const customTheme = EditorView.theme({
            '&.cm-editor.cm-focused': {
                outline: "none"   //移除外边框线
            },
            '&':{
                font: "16px Arial, monospace ",  //字体
            },
            '.cm-scroller':{
                "border-radius": "3px",
                "background-color":"#f6f6f6"
            }
        })
        
        extension = extension ?  [customTheme,myHistorySetup(editor,id)].concat([extension]) : [customTheme,myHistorySetup(editor,id)]

        return new CodemirrorEditorState(
            id,
            EditorState.create({
                doc: doc,
                extensions:extension
            }),
            {needSuggestUI:false}
        )
    }

}

export interface EditorViewOptions{
    //于视图捆绑的选择控件
    suggestUI:SearchSuggestUI;
    //编辑状态开关
    editorSwitch:(targetApply?: boolean) => void;
}

/**
 * 封装的视图信息
 */
 export class CodemirrorEditorView implements EditorViewOptions{
    //捆绑的dom元素
    public element:Element;
    //视图（可以通过视图获取对应的编辑器状态）
    public view:EditorView;
    //封装的视图信息
    public stateInfo:CodemirrorEditorState;
    //于视图捆绑的选择控件
    public suggestUI:SearchSuggestUI;
    //编辑状态开关
    public editorSwitch:(targetApply?: boolean) => void;

    constructor(element?:Element,view?:EditorView,stateInfo?:CodemirrorEditorState){
        this.element = element;
        this.view = view;
        this.stateInfo = stateInfo;
    }

    setOptions(options:EditorViewOptions){
        this.suggestUI = options.suggestUI
        this.editorSwitch = options.editorSwitch
    }
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
    public langCanLoad:string[];



    //编辑器是否已经加载
    public isLoaded:boolean;



    constructor(editor:YaLiEditor){
        this.editor = editor
        const customTheme = EditorView.theme({
            '&.cm-editor.cm-focused': {
                outline: "none"   //移除外边框线
            },
            '&':{
                font: "16px Arial, monospace ",  //字体
            },
            '.cm-scroller':{
                "background-color":"#f6f6f6"
            }
        })

        //初始化默认插件
        this.codemirrorPlugin = this.editor.ir.options.codemirrorPlugins.concat([
            customTheme,
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
        
        this.langCanLoad = languages.map(lang=>lang.name)
        
        
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



    /**
     * refresh cache
     * 刷新缓存，通过缓存区的编辑器状态生成codemirror编辑器,
     * 并一一刷新到页面上
     */
    refreshStateCache(elements:HTMLCollectionOf<Element>){

        this.allStateCache = this.allStateCache.filter(cache=>{
            
            
            //根据id识别
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

            const viewInfo = new CodemirrorEditorView(element,view,cache)
            this.allView.push(viewInfo);

            if(!cache.langCompartment){
                cache.langCompartment = createEditorCompartment()                
                if(cache.languageDescription){
                    cache.langCompartment.run(cache.languageDescription.support,view)
                }else {
                    cache.langCompartment.run([],view)
                }
            }
  
            if(!viewInfo.editorSwitch){                
                //设置编辑状态按钮(默认打开)
                let sw = createEditorExtensionToggler(view,[
                        EditorView.editable.of(false),
                        EditorState.readOnly.of(true)
                ])
                viewInfo.editorSwitch = sw;
            }


            //是否需要创建建议UI
            if(cache.needSuggestUI){
                const tooltip = document.createElement("div")
                element.appendChild(tooltip)
                tooltip.classList.add("md-code-tooltip");
                //tooltip.classList.add("md-hiden")
                tooltip.setAttribute("spellcheck","false");
                tooltip.setAttribute("editor-uuid",cache.editor_uuid)
                const suggest = new SearchSuggestUI()
                suggest.bindSearchSuggest(tooltip,this.langCanLoad)
                viewInfo.suggestUI = suggest

                tooltip.children[0].textContent = cache.lang
                tooltip.children[0].addEventListener("keyup",(event)=>{                    
                    this.updatedLang(tooltip.children[0].textContent,cache.editor_uuid) 
                })
            }

            
            element.setAttribute("contenteditable","false");

            return false
        })

    }

    /**
     * 对页面的所有视图进行销毁，将其编辑器状态重新放回缓存区
     * 让重新刷新缓存区，重新渲染codemirror编辑器面板
     * @param root 
     */
     refreshEditorViewSyn(root:HTMLElement){
        for (let index = 0; index < this.allView.length; index++) {
            
            const viewInfo = this.allView[index]
            //得到最新状态
            
            viewInfo.stateInfo.state = viewInfo.view.state

            //销毁原视图
            viewInfo.view.destroy()
            //viewInfo.view.dom.remove()
            //将数据重新放入缓存
            this.allStateCache.push(viewInfo.stateInfo)
        }
        //刷新视图
        delete this.allView
        this.allView = []
        //重新初始化视图
        this.initEditorViewSyn(root)

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
        setTimeout(() => {
            this.initEditorViewSyn(root)

        });
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

        this.allView.at(idx).view.focus()
    }

    disableEditAllView(){
        this.allView.forEach(viewInof=>{
            //关闭可编辑     
            viewInof.editorSwitch(true)
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
     * @param str 
     * @param lang 
     * @returns 
     */
    highlighter = (str:string,lang:string)=>{
        const pre = document.createElement("pre")
        pre.classList.add("markdown-it-code-beautiful")
        pre.setAttribute("md-block","fence")
        const uuid = uuidv4()
        pre.id = uuid
        if(str.endsWith("\n")){
            str = str.substring(0,str.length-1)
        }


        //封装扩展，以便修改
        let historyExtension = myHistorySetup(this.editor,uuid);

        const languageDescription = LanguageDescription.matchLanguageName(languages, lang, true);
        //Is it exist languageDescription
        //no: don't add lang extension
        if(!languageDescription){
            let startState = EditorState.create({
                doc: str,
                extensions:this.codemirrorPlugin.concat([historyExtension])
            })
            let info =  new CodemirrorEditorState(uuid,startState,{
                                                    needSuggestUI:true,
                                                    lang})
            this.allStateCache.push(info)
            return pre.outerHTML;
        }


        //存在语言支持，将语言支持合并到插件中
        let support = languageDescription.support
        if(!support){
            //语言未加载情况
            languageDescription.load().then(s=>{
                let combineExtension = this.codemirrorPlugin.concat([historyExtension]) 
                let startState = EditorState.create({
                    doc: str,
                    extensions:combineExtension,
                })
                let info =  new CodemirrorEditorState(uuid,startState,{
                    languageDescription,
                    needSuggestUI:true,
                    lang})
                this.allStateCache.push(info)
            })

        }else{
            //语言已加载情况
            let combineExtension = this.codemirrorPlugin.concat([historyExtension]) 
            let startState = EditorState.create({
                doc: str,
                extensions:combineExtension
            })
            let info =  new CodemirrorEditorState(uuid,startState,{
                languageDescription,
                needSuggestUI:true,
                lang})
            this.allStateCache.push(info)
        }
    
        return pre.outerHTML
    }




}






// 引入个性化的vs2015样式
//import 'highlight.js/styles/vs2015.css'

export default CodemirrorManager;


