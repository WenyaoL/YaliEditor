/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */


//import {Mathjax} from '@/markdown-it-plugin/markdown-it-mathjax-beautiful'
import list from '@/markdown-it-plugin/markdown-it-list-beautiful'

import emoji from 'markdown-it-emoji'
import toc from "@/markdown-it-plugin/markdown-it-toc-beautiful"
import markdownItMeta from '@/markdown-it-plugin/markdown-it-meta'
import imgplugin from '@/markdown-it-plugin/markdown-it-image-beautiful'
import link from '@/markdown-it-plugin/markdown-it-link-beautiful'

import _ from 'lodash'

import { basicSetup, minimalSetup } from "codemirror"
import { noLineNumberBasicSetup, gutterBasicSetup, myMinimalSetup } from '@/codemirror-plugin/codeStyle/codePlugin'
import { EditorView, keymap, ViewUpdate } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"


import BaseConfig from './BaseConfig'
import CommonConfig from './CommonConfig'
import IRPanelConfig from './IRPanelConfig'



export class EditorConfig {
    public commonConfig: CommonConfig;
    public ir: IRPanelConfig;

    constructor(commonConfig: CommonConfig, ir: IRPanelConfig) {
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
            .addMarkdownItPlugins({ plugin: list })
            .addMarkdownItPlugins({ plugin: emoji })
            .addMarkdownItPlugins({ plugin: toc })
            .addMarkdownItPlugins({ plugin: markdownItMeta })
            .addMarkdownItPlugins({ plugin: imgplugin })
            .addMarkdownItPlugins({ plugin: link })
            .addCodemirrorPlugins(myMinimalSetup)
            .addCodemirrorPlugins(keymap.of([indentWithTab]))
            .end()
            .commonConfig
            .setTestModel(false)
            .end()


        return editor
    }
}



