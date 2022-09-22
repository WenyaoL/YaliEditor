import MarkdownIt from 'markdown-it';
import {Mathjax} from '@/markdown-it-plugin/markdown-it-mathjax-beautiful'
import toc from "@/markdown-it-plugin/markdown-it-toc-beautiful"
import emoji from 'markdown-it-emoji'
//import { highlighter } from '@/codemirror-main/codeStyle/codeStyle';
import markdownItMeta from './markdown-it-meta'

import highlighter from './markdown-it-highlight-beautiful'
import list from './markdown-it-list-beautiful'
import CodemirrorManager from './markdown-it-code-beautiful'
import imgplugin from './markdown-it-image-beautiful'
import link  from './markdown-it-link-beautiful'
import './index.css'
import YaLiEditor from '@/YaliEditor/src';


class MarkdownBeautiful{
  //代码面板管理器,通过MarkdownBeautiful渲染的代码块，将会被codemirrorManager管理
  public codemirrorManager:CodemirrorManager;
  public mathjax:Mathjax;
  public md:MarkdownIt;
  public editor:YaLiEditor

  constructor(editor:YaLiEditor){
    this.editor =editor
    this.codemirrorManager = new CodemirrorManager(this.editor)
    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      breaks:true,
      highlight: this.codemirrorManager.highlighter
    })
    this.mathjax = new Mathjax(this.editor)
    this.md.use(this.mathjax.plugin)

    this.editor.ir.options.markdownItPlugins.forEach(mdp=>{
      this.md.use(mdp.plugin,mdp.options)
    })

    
  }

  initEditorView(rootElement:HTMLElement){
    this.codemirrorManager.initEditorView(rootElement)
  }

  refreshEditorView(rootElement:HTMLElement){
    this.codemirrorManager.refreshEditorViewSyn(rootElement)
  }

  refreshStateCache(rootElement:HTMLElement){
    const elements = rootElement.getElementsByClassName("markdown-it-code-beautiful")
    this.codemirrorManager.refreshStateCache(elements)
  }

  render(src:string){
    
    return this.md.render(src)
  }

}



export default MarkdownBeautiful;