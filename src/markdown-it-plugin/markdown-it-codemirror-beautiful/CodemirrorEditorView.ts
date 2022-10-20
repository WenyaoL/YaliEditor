import {EditorState,type Extension, Compartment,StateEffect} from "@codemirror/state"
import {EditorView, keymap,ViewUpdate} from "@codemirror/view"
import {EditorViewOptions} from './EditorOptions'
import {CodemirrorEditorState} from './CodemirrorEditorState'


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

    //编辑状态开关
    public editorSwitch:(targetApply?: boolean) => void;


    constructor(element?:Element,view?:EditorView,stateInfo?:CodemirrorEditorState){
        this.element = element;
        this.view = view;
        this.stateInfo = stateInfo;
    }

    setOptions(options:EditorViewOptions){
        this.editorSwitch = options.editorSwitch
    }
}