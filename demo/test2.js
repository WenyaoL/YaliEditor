import MarkdownIt from 'markdown-it'
import path from 'path';
import fs from 'fs'
import {highlighter} from "./codemirror-main/codeStyle/codeStyle"
//import toc from "./markdown-it-plugin/markdown-it-toc-beautiful"


const options = {
    html: true,
    linkify: true,
    typographer: true,
    breaks:true,
    highlight: highlighter
}

const md = new MarkdownIt(options).use(require('markdown-it-mathjax3'));



//md.use(toc)

let data = 'A_test_B'
let tokens = md.parse(data)


let res = md.renderer.render(tokens,options)

console.log(res);
