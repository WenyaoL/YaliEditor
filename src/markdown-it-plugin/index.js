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

  render(src){
    return this.md.render(src)
  }

}



export default MarkdownBeautiful;