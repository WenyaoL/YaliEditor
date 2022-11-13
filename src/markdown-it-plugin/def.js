import MarkdownIt from 'markdown-it';
//import {Mathjax} from '@/markdown-it-plugin/markdown-it-mathjax-beautiful'
import toc from "@/markdown-it-plugin/markdown-it-toc-beautiful"
import emoji from 'markdown-it-emoji'
//import { highlighter } from '@/codemirror-main/codeStyle/codeStyle';
import markdownItMeta from './markdown-it-meta'
import link  from './markdown-it-link-beautiful'
import highlighter from './markdown-it-highlight-beautiful'
import prismHighlighter from './markdown-it-prismjs-beautiful'
//import '@/markdown-it-plugin/markdown-it-toc-beautiful/index.css'
//import './markdown-it-link-beautiful/index.css'
import './index.scss'
import {multimd_table_plugin} from './markdown-it-table-beautiful'
import list from './markdown-it-list-beautiful'



var md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks:true,
    highlight: highlighter
  })
  .use(require('markdown-it-mathjax3'))
  //.use(Mathjax)
  .use(emoji)
  //.use(require('markdown-it-abbr'))
  //.use(require('markdown-it-footnote'))
  //.use(require('markdown-it-ins'))
  .use(toc)
  .use(markdownItMeta)
  .use(link)
  .use(multimd_table_plugin,{
    multiline:  true,
    rowspan:    false,
    headerless: true,
    multibody:  true,
    aotolabel:  true,
  })
  .use(list)


export default md;