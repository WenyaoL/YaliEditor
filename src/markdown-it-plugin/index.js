import MarkdownIt from 'markdown-it';
import mathjax from '@/markdown-it-plugin/markdown-it-mathjax-beautiful'
import toc from "@/markdown-it-plugin/markdown-it-toc-beautiful"
import emoji from 'markdown-it-emoji'
//import { highlighter } from '@/codemirror-main/codeStyle/codeStyle';
import markdownItMeta from './markdown-it-meta'
import link  from './markdown-it-link-beautiful'
import highlighter from './markdown-it-highlight-beautiful'
import CodemirrorManager from './markdown-it-code-beautiful'
import imgplugin from './markdown-it-image-beautiful'

import './index.css'


class MarkdownBeautiful{
  //代码面板管理器,通过MarkdownBeautiful渲染的代码块，将会被codemirrorManager管理
  codemirrorManager;
  md;

  constructor(){
    this.codemirrorManager = new CodemirrorManager()
    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      breaks:true,
      highlight: this.codemirrorManager.highlighter
    })
    //.use(require('markdown-it-mathjax3'))
    .use(mathjax)
    .use(emoji)
    //.use(require('markdown-it-abbr'))
    //.use(require('markdown-it-footnote'))
    //.use(require('markdown-it-ins'))
    .use(toc)
    .use(markdownItMeta)
    .use(link)
    .use(imgplugin)
  
  }

  initEditorView(rootElement){
    this.codemirrorManager.initEditorView(rootElement)
  }

  refreshEditorView(rootElement){
    this.codemirrorManager.refreshEditorViewSyn(rootElement)
  }

  refreshStateCache(rootElement){
    const elements = rootElement.getElementsByClassName("markdown-it-code-beautiful")
    this.codemirrorManager.refreshStateCache(elements)
  }

  render(src){
    return this.md.render(src)
  }

}



export default MarkdownBeautiful;