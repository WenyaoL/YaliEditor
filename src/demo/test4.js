/*const fs = require('fs')
const path = require('path')
let data = fs.readFileSync(path.normalize('C:/Users/liangwy/Desktop/测试文件夹/测试5.txt'),{encoding:'utf8', flag:'r'})
data = data.replaceAll("\r\n","\n")
fs.writeFileSync(path.normalize('C:/Users/liangwy/Desktop/测试文件夹/Linux.txt'),data)
console.log(data);*/



import MarkdownIt from 'markdown-it'
import path from 'path';
import fs from 'fs'
import {highlighter} from "../codemirror-plugin/codeStyle/codeStyle"
import toc from "../markdown-it-plugin/markdown-it-toc-beautiful"
//import mathjax3 from '../markdown-it-plugin/markdown-it-mathjax-beautiful'
import TurndownService from 'turndown';

const options = {
    html: true,
    linkify: true,
    typographer: true,
    breaks:true,
    highlight: highlighter
}

let data = fs.readFileSync(path.normalize('C:/Users/liangwy/Desktop/测试文件夹/测试markdown.md'),{encoding:'utf8', flag:'r'})
let linuxData = data.replaceAll("\r\n","\n")
let windowData = data

const md = new MarkdownIt(options).use(toc);
        //.use(mathjax3)
        

let linuxTokens = md.parse(linuxData)
let windowTokens = md.parse(windowData)

let linuxres = md.renderer.render(linuxTokens,options)
let windowres = md.renderer.render(windowTokens,options)

fs.writeFileSync(path.normalize('C:/Users/liangwy/Desktop/测试文件夹/Linux.txt'),linuxData)
fs.writeFileSync(path.normalize('C:/Users/liangwy/Desktop/测试文件夹/Window.txt'),windowData)

fs.writeFileSync(path.normalize('C:/Users/liangwy/Desktop/测试文件夹/LinuxM.txt'),linuxres)
fs.writeFileSync(path.normalize('C:/Users/liangwy/Desktop/测试文件夹/WindowM.txt'),windowres)



var turndownService = new TurndownService({headingStyle:"atx"})


turndownService.addRule('md-codeing',{
    filter: function (node, options) {
      let flag = (
        node.nodeName === 'PRE' &&
        node.childNodes.length>1 &&
        node.childNodes.item(1) &&
        node.childNodes.item(1).nodeName === 'CODE'
      )
      return flag
    },
  
    replacement: function (content, node, options) {
      const language = (node.lastElementChild.className.match(/language-(\S+)/) || [null, ''])[1]
      return (
        '\n```'+ language + '\n' +
        node.childNodes.item(1).textContent.replace(/\n/g, '\n') +
        '```\n\n'
      )
    }
})
function cleanAttribute (attribute) {
    return attribute ? attribute.replace(/(\n+\s*)+/g, '\n') : ''
}
turndownService.addRule('md-img',{
    filter:['img'],
    replacement:(content, node, options) =>{
        var alt = cleanAttribute(node.getAttribute('alt'));
        var src = node.getAttribute('src') || '';
        src = path.normalize(decodeURIComponent(src))
        var title = cleanAttribute(node.getAttribute('title'));
        var titlePart = title ? ' "' + title + '"' : '';
        return src ? '![' + alt + ']' + '(' + src + titlePart + ')' : ''
    }
})

/*turndownService.addRule('md-heading-anchor',{
    filter: function (node, options) {
        let flag = (
            node.nodeName === 'A' &&
            node.getAttribute('href') &&
            node.classList.contains('heading-anchor')
          )
      return flag
    },
  
    replacement: function (content, node) {
      return ''
    }
  })*/

/*turndownService.addRule('md-heading',{
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    replacement:(content, node, options)=>{
        var hLevel = Number(node.nodeName.charAt(1));
        
        return '\n\n' + '#'.repeat(hLevel) + ' ' + content + '\n\n'
    }
})*/

turndownService.addRule('md-toc',{
    filter:function (node, options) {
        let flag = (
          node.nodeName === 'DIV' &&
          node.classList.contains('markdown-it-toc-beautiful')
        )
        return flag;
    },
    replacement:function(content, node, options) {
        return '[toc]';
    }
})


turndownService.addRule('md-mathjax',{
  filter:function(node,options){
    return  (node.classList.contains("markdown-it-mathjax-beautiful")  &&
            node.nodeName === "DIV")
  },
  replacement:function(content, node, options) {
    if(node.childNodes.length>1){
      const value = node.children.item(0).textContent
      return '\n$$\n'+
            value + 
            '\n$$\n'
    }
    
    return '';
  }
})



//var markdown = turndownService.turndown(data)
//let linuxturndown = turndownService.turndown(linuxres)
let windowturndown = turndownService.turndown(windowres)


console.log(windowturndown);
//console.log(windowData);
