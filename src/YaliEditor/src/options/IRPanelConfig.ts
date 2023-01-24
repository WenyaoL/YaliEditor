import BaseConfig from './BaseConfig'
import { EditorConfig } from './'
import MarkdownIt from 'markdown-it';
import { Extension } from '@codemirror/state';

export class IRPanelConfig implements BaseConfig {

    editorConfig?: EditorConfig

    //IR面板中Codemirror组件的插件
    codemirrorPlugins: Extension[] = [];

    //markdonw-it插件
    markdownItPlugins: {
        plugin: MarkdownIt.PluginWithOptions<any> | MarkdownIt.PluginSimple | MarkdownIt.PluginWithParams,
        options?: any
    }[] = [];

    disableEdit?: boolean;  //可编辑模式

    theme?: string;  //主题

    borderModel:boolean = true;  //边界模式（决定是否要渲染字体的边界）

    constructor() { }

    addMarkdownItPlugins(...plugin: {
        plugin: MarkdownIt.PluginWithOptions<any> | MarkdownIt.PluginSimple | MarkdownIt.PluginWithParams,
        options?: any
    }[]) {
        this.markdownItPlugins.push(...plugin)
        return this
    }

    addCodemirrorPlugins(extension: Extension) {
        this.codemirrorPlugins.push(extension)
        return this
    }

    setTheme(theme: string) {
        this.theme = theme
        return this
    }

    setDisableEdit(disableEdit: boolean) {
        this.disableEdit = disableEdit
        return this
    }

    setBorderModel(flag:boolean){
        this.borderModel = flag
    }

    end() {
        return this.editorConfig
    }

}

export default IRPanelConfig