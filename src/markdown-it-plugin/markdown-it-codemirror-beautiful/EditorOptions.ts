import {LanguageDescription} from "@codemirror/language"
import {type Extension, Compartment} from "@codemirror/state"

import {EditorView} from "@codemirror/view"

export interface EditorStateOptions{
    langCompartment?:{compartment:Compartment,run:(extension: Extension,view:EditorView) => void},
    lang?:string,
    needSuggestUI?:boolean,

    languageDescription?:LanguageDescription
}



export interface EditorViewOptions{

    //编辑状态开关
    editorSwitch:(targetApply?: boolean) => void;
}