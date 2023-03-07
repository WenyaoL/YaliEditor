import MarkdownIt from 'markdown-it';
//import {Mathjax} from '@/markdown-it-plugin/markdown-it-mathjax-beautiful'
import toc from "./markdown-it-toc-beautiful"
import emoji from 'markdown-it-emoji'


import link  from './markdown-it-link-beautiful'

import markdownItFontBeautiful from './markdown-it-font-beautiful'
import markdownItCodeblockBeautiful from './markdown-it-codeblock-beautiful'
import markdownItBlockquoteBeautiful from './markdown-it-blockquote-beautiful'
import markdownItHrBeautiful from './markdown-it-hr-beautiful'

import highlighter from './markdown-it-highlight-beautiful'
import prismHighlighter from './markdown-it-prismjs-beautiful'
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
  .use(toc)
  .use(markdownItFontBeautiful)
  .use(markdownItCodeblockBeautiful)
  .use(markdownItBlockquoteBeautiful)
  .use(markdownItHrBeautiful)
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