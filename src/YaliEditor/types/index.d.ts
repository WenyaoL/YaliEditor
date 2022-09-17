import type YaLiEditor from "../src";
import { Extension } from '@codemirror/state';
import MarkdownIt from 'markdown-it';

/**
 * 编辑器选项
 */
interface YaLiEditorOptions {
    //是否为测试模式
    isTestModel:boolean
}
/**
 * IR控制面板选项
 */
interface IROptions{


    //IR面板中Codemirror组件的插件
    codemirrorPlugins?: Extension[];

    //markdonw-it插件
    markdownItPlugins?:{
        plugin: MarkdownIt.PluginWithOptions<any> | MarkdownIt.PluginSimple|MarkdownIt.PluginWithParams, 
        options?: any
    }[]

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