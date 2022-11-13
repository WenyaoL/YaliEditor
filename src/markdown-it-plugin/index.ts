import MarkdownIt from 'markdown-it';
import {Mathjax} from '@/markdown-it-plugin/markdown-it-mathjax-beautiful'

//import { highlighter } from '@/codemirror-main/codeStyle/codeStyle';


import highlighter from './markdown-it-highlight-beautiful'

//import CodemirrorManager from './markdown-it-code-beautiful'
import CodemirrorManager from './markdown-it-codemirror-beautiful'

import './index.scss'
import YaLiEditor from '@/YaliEditor/src';
//import table from 'markdown-it-multimd-table'
import { MultimdTable,multimd_table_plugin } from './markdown-it-table-beautiful'



class MarkdownBeautiful{
  //代码面板管理器,通过MarkdownBeautiful渲染的代码块，将会被codemirrorManager管理
  public codemirrorManager:CodemirrorManager;
  public mathjax:Mathjax;
  public md:MarkdownIt;
  public editor:YaLiEditor
  public table:MultimdTable
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

    this.table = new MultimdTable({
      multiline:  true,
      rowspan:    false,
      headerless: true,
      multibody:  true,
      aotolabel:  true,
    })

    this.md.use(this.table.multimd_table_plugin,this.table)
    this.mathjax = new Mathjax(this.editor)
    this.md.use(this.mathjax.plugin)

    this.editor.ir.options.markdownItPlugins.forEach(mdp=>{
      this.md.use(mdp.plugin,mdp.options)
    })

    
  }

  initEditorView(rootElement:HTMLElement){
    return this.codemirrorManager.initEditorView(rootElement)
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

  setTheme(theme:string){
    this.codemirrorManager.selectTheme(theme)
    this.table.setTheme(theme)
  }
  
}



export default MarkdownBeautiful;