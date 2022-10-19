import {LanguageDescription} from "@codemirror/language"
import {type Extension, Compartment} from "@codemirror/state"
import SearchSuggestUI from './ui'
import {EditorView} from "@codemirror/view"

export interface EditorStateOptions{
    langCompartment?:{compartment:Compartment,run:(extension: Extension,view:EditorView) => void},
    lang?:string,
    needSuggestUI?:boolean,

    languageDescription?:LanguageDescription
}



export interface EditorViewOptions{
    //于视图捆绑的选择控件
    suggestUI:SearchSuggestUI;
    //编辑状态开关
    editorSwitch:(targetApply?: boolean) => void;
}