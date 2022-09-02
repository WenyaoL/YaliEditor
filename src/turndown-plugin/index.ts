import YaLiEditor from '@/YaliEditor/src';
import TurndownService from 'turndown';


class TurndownParser{
  turndownService:TurndownService;
  editor:YaLiEditor;

  constructor(editor:YaLiEditor){
    this.editor = editor
    this.turndownService = new TurndownService({headingStyle:"atx"})
    this.initCodeRule()
    this.initImgRule()
    this.initMathjaxRule()
    this.initTocRule()
    this.initCodemirrorRule(this.editor)
    this.initLinkRule()
    this.initInineCodeRule()
  }

  /**
   * 初始化高亮代码解析规则
   */
  initCodeRule(){
    this.turndownService.addRule('md-codeing',{
      filter: function (node, options) {
        let flag = (
          node.nodeName === 'PRE' &&
          node.classList.contains("hljs")
        )
        return flag
      },
      replacement: function (content, node, options) {
        const language = (node.lastElementChild.className.match(/language-(\S+)/) || [null, ''])[1]
        return (
          '\n```'+ language + '\n' +
          node.lastElementChild.textContent.replace(/\n/g, '\n') +
          '```\n\n'
        )
      }
    })
  }

  initInineCodeRule(){
    this.turndownService.addRule('md-inline-codeing',{
      filter: function (node, options) {
        let flag = (
          node.nodeName === 'CODE' &&
          node.getAttribute('md-inline') === "code"
        )
        return flag
      },
      replacement: function (content, node, options) {
        return '`'+content+'`';
      }
    })    
  }

  initCodemirrorRule(editor:YaLiEditor){
    this.turndownService.addRule('md-codemirror',{
      filter: function (node, options) {
        let flag = (
          node.nodeName === 'PRE' &&
          node.classList.contains("markdown-it-code-beautiful")
        )
        return flag
      },
      replacement: function (content, node, options) {
        node = node as HTMLElement
        const uuid = node.id
        const text = editor.ir.renderer.codemirrorManager.getTextValue(uuid)
        if(!text) return ''
        const language = node.lastElementChild.getElementsByClassName("tooltip-input")[0].textContent.trim()
        return '\n```'+ language + '\n' +
                text +
                '```\n\n'
      }
    })
  }

  initImgRule(){
    this.turndownService.addRule('md-img',{
      filter:function (node, options) {
        let flag = (
          node.nodeName === 'SPAN' &&
          node.getAttribute("md-inline") === "img"
        )
        return flag;
        },
        replacement:(content, node, options) =>{
            node.firstElementChild.textContent
            return node.firstElementChild.textContent
        }
    })
  }

  initTocRule(){
    this.turndownService.addRule('md-toc',{
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
  }

  initMathjaxRule(){
    this.turndownService.addRule('md-mathjax',{
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
  }

  initLinkRule(){
    this.turndownService.addRule('md-link',{
      filter:function (node, options) {
        let flag = (
          node.nodeName === 'SPAN' &&
          node.getAttribute("md-inline") === "link"
        )
        return flag;
        },
        replacement:(content, node, options) =>{
            return node.textContent
        }
    })
  }

  turndown(src:string | TurndownService.Node){
    return this.turndownService.turndown(src)
  }

}




function cleanAttribute (attribute:string) {
    return attribute ? attribute.replace(/(\n+\s*)+/g, '\n') : ''
}


export default TurndownParser;