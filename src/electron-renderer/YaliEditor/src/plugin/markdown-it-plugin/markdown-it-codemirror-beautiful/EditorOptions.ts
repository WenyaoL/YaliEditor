import {LanguageDescription} from "@codemirror/language"
import {type Extension, Compartment} from "@codemirror/state"

import {EditorView} from "@codemirror/view"
import { App } from "vue";

export interface EditorStateOptions{
    
    lang?:string;
    needSuggestUI?:boolean;

    languageDescription?:LanguageDescription;

    //编辑状态开关
    editorSwitch?:(targetApply?: boolean) => void;
    //语言包的切换
    langCompartment?:{compartment:Compartment,run:(extension: Extension,view:EditorView) => void};
    //主题的切换
    themeCompartment?:{compartment:Compartment,run:(extension: Extension,view:EditorView) => void};

    //输入选项组件
    inputComponent?:App
}



export interface EditorViewOptions{
    //捆绑的dom元素
    element:Element;
    //视图（可以通过视图获取对应的编辑器状态）
    view:EditorView;
    
}