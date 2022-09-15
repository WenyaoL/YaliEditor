
import fs from 'fs';
import path from 'path'
import TurndownService from 'turndown';
//var TurndownService = require('turndown')
var turndownService = new TurndownService({
    headingStyle:"atx"
})

console.log(turndownService.rules.defaultRule);


console.log(turndownService.rules.defaultRule);
turndownService.addRule('md-codeing',{
    filter: function (node, options) {
      let flag = (
        options.codeBlockStyle === 'indented' &&
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
        '```'+ language + '\n' +
        node.childNodes.item(1).textContent.replace(/\n/g, '\n') +
        '```\n'
      )
    }
})

turndownService.addRule('md-inlineLink',{
    filter: function (node, options) {
        let flag = (
            options.linkStyle === 'inlined' &&
            node.nodeName === 'A' &&
            node.getAttribute('href')
          )
        if(flag){
            const html = node.outerHTML
            const text = node.innerText
        }  
      return flag
    },
  
    replacement: function (content, node) {
      var href = node.getAttribute('href');
      var title = node.getAttribute('title');
      if (title) title = ' "' + title + '"';
      return '[' + content + '](' + href + title + ')'
    }
  })

turndownService.addRule('md-heading',{
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    replacement:(content, node, options)=>{
        var hLevel = Number(node.nodeName.charAt(1));
        
        return '\n\n' + '#'.repeat(hLevel) + ' ' + content + '\n\n'
    }
})


//let data = fs.readFileSync(path.normalize('C:/Users/liangwy/Desktop/测试文件夹/window.txt'),{encoding:'utf8', flag:'r'})
let data2 = fs.readFileSync(path.normalize('C:/Users/liangwy/Desktop/测试文件夹/LinuxM.txt'),{encoding:'utf8', flag:'r'})
//var markdown = turndownService.turndown(data)
var markdown2 = turndownService.turndown(data2)

//console.log(markdown);
console.log(markdown2);