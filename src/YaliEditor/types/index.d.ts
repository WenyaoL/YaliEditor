import type YaLiEditor from "../src";

interface YaLiEditorOptions {

    isTestModel:boolean
}

interface BaseEventBinder{
    //捆绑的编辑器
    editor:YaLiEditor;

    

    /**
     * bindEvent on the element
     * 在HTMLElement上绑定事件
     */
    bindEvent(element:HTMLElement):void;
}