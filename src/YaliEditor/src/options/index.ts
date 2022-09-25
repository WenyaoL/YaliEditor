/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { IROptions, YaLiEditorOptions } from "@/YaliEditor/types";
import IRInputBinder from "../eventbinder/IRInputBinder";

//import {Mathjax} from '@/markdown-it-plugin/markdown-it-mathjax-beautiful'
import list from '@/markdown-it-plugin/markdown-it-list-beautiful'
import emoji from 'markdown-it-emoji'
import toc from "@/markdown-it-plugin/markdown-it-toc-beautiful"
import markdownItMeta from '@/markdown-it-plugin/markdown-it-meta'
import imgplugin from '@/markdown-it-plugin/markdown-it-image-beautiful'
import link  from '@/markdown-it-plugin/markdown-it-link-beautiful'

import {basicSetup,minimalSetup} from "codemirror"
import {noLineNumberBasicSetup,gutterBasicSetup,myMinimalSetup} from '@/codemirror-plugin/codeStyle/codePlugin'
import {EditorView, keymap,ViewUpdate} from "@codemirror/view"
import {indentWithTab} from "@codemirror/commands"



export class EditorOptions {
    public yali: YaLiEditorOptions;
    public ir:IROptions
    

    constructor(yaLiEditorOptions?:YaLiEditorOptions,
                irOptions?:IROptions) {
        this.yali = yaLiEditorOptions;
        this.ir = irOptions;
    }

    /**
     * 
     */
    public merge(other:EditorOptions):EditorOptions{
        if(!other) return this

        return null
    }

    /**
     * 生成一个defalut选项
     */
    static defalut(){

        const yali:YaLiEditorOptions={
            isTestModel:false
        }

        const ir:IROptions={
            markdownItPlugins:[
                //{plugin: mathjax},
                {plugin: list},
                {plugin: emoji},
                {plugin: toc},
                {plugin: markdownItMeta},
                {plugin: imgplugin},
                {plugin: link}
            ],
            codemirrorPlugins:[
                myMinimalSetup,
                //gutterBasicSetup,
                keymap.of([indentWithTab]),
            ]
        }

        return new EditorOptions(yali,ir)
    }

}

