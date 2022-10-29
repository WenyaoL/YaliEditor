 /**
 * @author liangwenyao
 */
import {LanguageDescription} from "@codemirror/language"
import {EditorState,type Extension, Compartment,StateEffect} from "@codemirror/state"
import {EditorView} from "@codemirror/view"
import {EditorStateOptions} from './EditorOptions'
/**
 * 封装的EditorState
 */
export class CodemirrorEditorState implements EditorStateOptions{
 
    //uuid
    public editor_uuid : string;
    //codemirror编辑器初始化状态
    public state:EditorState;

    //当前客户指定使用的语言包名
    public lang:string='';
    //当前匹配到的语言描述信息
    public languageDescription:LanguageDescription;
    //是否需要创建建议UI
    public needSuggestUI:boolean=true;
    
   //语言包插件（codemirror盒子能动态更改插件内容）
   public langCompartment:{compartment:Compartment,run:(extension: Extension,view:EditorView) => void};

    //编辑器主题
    public themeCompartment:{compartment:Compartment,run:(extension: Extension,view:EditorView) => void};

    //编辑状态开关
    public editorSwitch:(targetApply?: boolean) => void;


    constructor(
        uuid:string,
        state:EditorState,
        options?:EditorStateOptions
    ){
        this.editor_uuid = uuid
        this.state = state;

        if(options){
           this.langCompartment = options.langCompartment;
           this.lang = options.lang;
           this.needSuggestUI = options.needSuggestUI;
           this.languageDescription = options.languageDescription
        }

    }

    /**
     * 创建一个简易的编辑器状态
     * @param id 
     * @param doc 
     */
    static of(id:string,doc:string,extension?:Extension,options?:EditorStateOptions){
       if(!extension) extension = []
       
        return new CodemirrorEditorState(
            id,
            EditorState.create({
                doc: doc,
                extensions:extension
            }),
            options
        )
    }

}