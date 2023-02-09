import MarkdownIt from 'markdown-it';

import CodemirrorManager from './markdown-it-codemirror-beautiful'
import markdownItFontBeautiful from './markdown-it-font-beautiful'
import markdownItCodeblockBeautiful from './markdown-it-codeblock-beautiful'
import markdownItBlockquoteBeautiful from './markdown-it-blockquote-beautiful'
import markdownItHrBeautiful from './markdown-it-hr-beautiful'
import markdownItMetaBeautiful from './markdown-it-meta-beautiful'
import markdownItHTMLBeautiful from './markdown-it-html-beautiful'
import markdownItListBeautiful from './markdown-it-list-beautiful'
import markdownItTocBeautiful from "./markdown-it-toc-beautiful"
import markdownItImageBeautiful from './markdown-it-image-beautiful'
import markdownItLinkBeautiful from './markdown-it-link-beautiful'
import { MultimdTable} from './markdown-it-table-beautiful'
import {Mathjax} from './markdown-it-mathjax-beautiful'

import './index.scss'
import YaLiEditor from '@/YaliEditor/src';
import { isMdBlockFence } from '@/YaliEditor/src/util/inspectElement';



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
      linkify: false,
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
    
    this.md.use(markdownItFontBeautiful,{borderModel:this.editor.options.ir.borderModel})
    this.md.use(markdownItCodeblockBeautiful)
    this.md.use(markdownItHrBeautiful)
    this.md.use(markdownItBlockquoteBeautiful)
    this.md.use(markdownItMetaBeautiful)
    this.md.use(markdownItHTMLBeautiful,{editor:this.editor})
    this.md.use(markdownItListBeautiful)
    this.md.use(markdownItTocBeautiful)
    this.md.use(markdownItImageBeautiful,{editor:this.editor})
    this.md.use(markdownItLinkBeautiful)
    
    this.editor.ir.options.markdownItPlugins.forEach(mdp=>{
      this.md.use(mdp.plugin,mdp.options)
    })

    this.subscribe()
  }

  initEditorView(rootElement:HTMLElement){
    return this.codemirrorManager.initEditorView(rootElement)
  }

  refreshEditorView(rootElement:HTMLElement){
    this.codemirrorManager.refreshEditorViewSyn(rootElement)
  }

  refreshStateCache(rootElement:HTMLElement){
    const elements = rootElement.querySelectorAll(".markdown-it-code-beautiful")
    this.codemirrorManager.refreshStateCache(elements)
  }

  render(src:string){
    return this.md.render(src)
  }

  setTheme(theme:string){
    this.codemirrorManager.selectTheme(theme)
    this.table.setTheme(theme)
  }
  
  subscribe(){
    this.editor.ir.applicationEventPublisher.subscribe("clickChanged",({block,inline})=>{
      if(isMdBlockFence(block))this.codemirrorManager.mountInputComponent((block as HTMLElement).id)
    })
  }


}



export default MarkdownBeautiful;