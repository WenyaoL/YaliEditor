/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */


//import {Mathjax} from '@/markdown-it-plugin/markdown-it-mathjax-beautiful'

import emoji from 'markdown-it-emoji'
import { myMinimalSetup } from '../plugin/codemirror-plugin/codeStyle/codePlugin'
import { keymap} from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"


import BaseConfig from './BaseConfig'
import CommonConfig from './CommonConfig'
import IRPanelConfig from './IRPanelConfig'



export class EditorConfig {
    public commonConfig: CommonConfig;
    public ir: IRPanelConfig;

    private constructor(commonConfig: CommonConfig, ir: IRPanelConfig) {
        this.commonConfig = commonConfig;
        this.commonConfig.editorConfig = this

        this.ir = ir;
        this.ir.editorConfig = this
    }


    /*public merge(options?: EditorConfig){
        //浅拷贝
        Object.assign(this.commonConfig,options.commonConfig)
        Object.assign(this.ir,options.ir)
        return this
    }*/

    /**
     * 生成一个defalut选项
     */
    public static defalut() {

        const common = new CommonConfig()
        const ir = new IRPanelConfig()
        const editor = new EditorConfig(common, ir)

        editor
            .ir
            //.addMarkdownItPlugins({ plugin: emoji })
            .addCodemirrorPlugins(myMinimalSetup)
            .addCodemirrorPlugins(keymap.of([indentWithTab]))
            .end()
            .commonConfig
            .setTestModel(false)
            .end()


        return editor
    }
}



