import {EditorState,type Extension, Compartment} from "@codemirror/state"
import {EditorView, keymap,ViewUpdate} from "@codemirror/view"
import {defaultKeymap,indentWithTab} from "@codemirror/commands"
import {basicSetup} from "codemirror"
import {languages} from "@codemirror/language-data"
import {LanguageDescription} from "@codemirror/language"
import { javascript } from '@codemirror/lang-javascript'
import SearchSuggestUI from './ui'
import { v4 as uuidv4 } from 'uuid';


/**
 * 封装的EditorState
 */
class CodemirrorEditorState{

    //uuid
    public editor_uuid : string;
    //codemirror编辑器状态
    public state:EditorState;
    //codemirror盒子（能动态更改插件内容）
    public langCompartment:Compartment;
    //当前客户指定使用的语言包名
    public lang:string;

    constructor(uuid:string,state:EditorState,langCompartment:Compartment,lang?:string){
        this.editor_uuid = uuid
        this.state = state;
        this.langCompartment = langCompartment;
        if(!lang)
            this.lang = "";
        else{
            this.lang = lang;
        }
    }
}

/**
 * 封装的视图信息
 */
class CodemirrorEditorView{
    //捆绑的dom元素
    public element:Element;
    //视图（可以通过视图获取对应的编辑器状态）
    public view:EditorView;
    //封装的视图信息
    public stateInfo:CodemirrorEditorState;

    constructor(element:Element,view:EditorView,stateInfo:CodemirrorEditorState){
        this.element = element;
        this.view = view;
        this.stateInfo = stateInfo;
    }
}



/**
 * codemirror管理器，
 * 用于管理页面内的codemirror editor
 */
class CodemirrorManager{
    //编辑器
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



    constructor(){

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
        //初始化默认插件
        this.codemirrorPlugin = [
            basicSetup,
            keymap.of([indentWithTab]),
            customTheme,
            EditorView.lineWrapping,
            EditorView.updateListener.of((viewUpdate) => { // 默认自带的监听器
                
                if (viewUpdate.docChanged && viewUpdate.state.doc.length === 0) {
                    viewUpdate.view.dom.setAttribute("is-empty","true")
                    
                }
                if (viewUpdate.docChanged && viewUpdate.state.doc.length > 0) {
                    viewUpdate.view.dom.setAttribute("is-empty","false")
                }
            })
        ]


        /*if (viewUpdate.docChanged && viewUpdate.changes.newLength === 0) {
            viewUpdate.view.dom.setAttribute("isEmpty","true")
        }*/
        this.langCanLoad = languages.map(lang=>lang.name)
        
        
    }

    addViewUpdateListener(listener:(update: ViewUpdate)=>void){
        this.viewlistener = listener
        //插入事件监听器
        this.codemirrorPlugin.push(EditorView.updateListener.of(this.viewlistener))
    }   

    /**
     * refresh cache
     * 刷新缓存
     */
    refreshCache(){
        this.allStateCache = [];
        
    }

    /**
     * 同步方式刷新视图
     */
     refreshEditorViewSyn(root:HTMLElement){
        const elements = root.getElementsByClassName("markdown-it-code-beautiful")
        for (let index = 0; index < this.allView.length; index++) {
            
            const viewInfo = this.allView[index]

            //销毁原视图
            viewInfo.view.destroy()
            
            //得到最新状态
            viewInfo.stateInfo.state = viewInfo.view.state
            //将数据重新放入缓存
            this.allStateCache.push(viewInfo.stateInfo)
        }
        //刷新视图
        this.allView = []
        //重新初始化视图
        this.initEditorViewSyn(root)
     }


    /**
     * 重新跟新视图状态
     */
    refreshEditorView(root:HTMLElement){
        console.log("刷新视图");

        setTimeout(() => {
            const elements = root.getElementsByClassName("markdown-it-code-beautiful")
            for (let index = 0; index < this.allView.length; index++) {
                
                const viewInfo = this.allView[index]

                //销毁原视图
                viewInfo.view.destroy()
                
                //得到最新状态
                viewInfo.stateInfo.state = viewInfo.view.state
                //将数据重新放入缓存
                this.allStateCache.push(viewInfo.stateInfo)
            }
            //刷新视图
            this.allView = []
            //重新初始化视图
            this.initEditorView(root)
        })
    }

    /**
     * 同步的方式初始化编辑器
     * 注意：请确保语言包已经加载完成，否则有可以导致某些编辑模块无法使用语言包
     * @param root 
     */
    initEditorViewSyn(root:HTMLElement){
        const elements = root.getElementsByClassName("markdown-it-code-beautiful")
        for (let index = 0; index < this.allStateCache.length; index++) {
            const cache = this.allStateCache[index];
            //根据id识别
            const element:Element = elements.namedItem(cache.editor_uuid)
            let view = new EditorView({
                state: cache.state,
                parent: element,
            })
            
            //view.lineWrapping = true;
            this.allView.push(new CodemirrorEditorView(element,view,cache));
            element.setAttribute("contenteditable","false");

            const tooltip = document.createElement("div")
            
            //tooltip.classList.add("md-hiden")

            element.appendChild(tooltip)
            tooltip.classList.add("md-code-tooltip");
            //tooltip.classList.add("md-hiden")
            tooltip.setAttribute("spellcheck","false");
            tooltip.setAttribute("editor-uuid",cache.editor_uuid)
            new SearchSuggestUI().bindSearchSuggest(tooltip,this.langCanLoad)
            tooltip.children[0].textContent = cache.lang

            tooltip.children[0].addEventListener("keyup",(event)=>{
               this.updatedLang(tooltip.children[0].textContent,cache.editor_uuid) 
            })
        }
        this.refreshCache();
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
        const viewInfo =  this.allView.at(idx);
        viewInfo.view.destroy()
        this.allView.splice(idx,1)
        console.log(this.allView.length);
        
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
            viewInfo.view.dispatch({
                effects:stateInfo.langCompartment.reconfigure(support)
            })
        }else{//去加载并跟新
            languageDescriptions.load().then(s=>{
                viewInfo.view.dispatch({
                    effects:stateInfo.langCompartment.reconfigure(s)
                })
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
            let res = viewInfo.stateInfo.state.doc.toString()
            return res;
        }else{
            console.log("发现undif,uuid为:",uuid);
            return ''
        }
            
    }

    /**
     * 给markdown-it的高亮器插件，使得markdown-it能使用codemirror作为代码编辑器
     * 
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
    
        //封装扩展，以便修改
        let compartment = new Compartment()
        let languageExtension = null;
        const languageDescriptions = LanguageDescription.matchLanguageName(languages, lang, true);

        //Is it exist languageDescription
        //no: don't add lang extension
        if(!languageDescriptions){
            let startState = EditorState.create({
                doc: str,
                extensions:this.codemirrorPlugin.concat([compartment.of([])])
            })
            this.allStateCache.push(new CodemirrorEditorState(uuid,startState,compartment,lang))
            return pre.outerHTML;
        }


        //存在语言支持，将语言支持合并到插件中
        let support = languageDescriptions.support
        if(!support){
            //语言未加载情况
            languageDescriptions.load().then(s=>{
                support = s
                languageExtension = compartment.of(support)
                let combineExtension = this.codemirrorPlugin.concat([languageExtension]) 
                let startState = EditorState.create({
                    doc: str,
                    extensions:combineExtension,
                })
                this.allStateCache.push(new CodemirrorEditorState(uuid,startState,compartment,lang))
            })

        }else{
            //语言已加载情况
            languageExtension = compartment.of(support)
            let combineExtension = this.codemirrorPlugin.concat([languageExtension]) 
            let startState = EditorState.create({
                doc: str,
                extensions:combineExtension
            })
            this.allStateCache.push(new CodemirrorEditorState(uuid,startState,compartment,lang))
        }
    
        return pre.outerHTML
    }




}


// 引入个性化的vs2015样式
//import 'highlight.js/styles/vs2015.css'

export default CodemirrorManager;


