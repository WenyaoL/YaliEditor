import YaLiEditor from '@/YaliEditor/src';
import TurndownService from 'turndown';
import tableRule from './table'

class TurndownParser{
  turndownService:TurndownService;
  editor:YaLiEditor;

  constructor(editor:YaLiEditor){
    this.editor = editor
    this.turndownService = new TurndownService({
      headingStyle:"atx",
      emDelimiter:'*'
    })
    this.initCodeRule()
    this.initImgRule()
    this.initMathjaxRule()
    this.initTocRule()
    this.initCodemirrorRule(this.editor)
    this.initLinkRule()
    this.initInineCodeRule()
    this.initFontRule()
    this.turndownService.use(tableRule)
    //this.initTableRule()
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

        if(text.endsWith("\n")) return '\n```'+ language + '\n' + text +'```\n\n'
        else return '\n```'+ language + '\n' + text +'\n```\n\n'
        
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
        if(node.children.length>1){
          let e = node as HTMLElement
          const value = e.getElementsByClassName("md-mathblock-input").item(0).textContent
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
            node = node as HTMLElement
            //获取A标签
            const a = node.getElementsByTagName("a").item(0)
            if(!a) return ''
            return '['+a.textContent+']('+a.href+')';
        }
    })
  }

  initFontRule(){
    //删除线
    this.turndownService.addRule('md-font-del',{
      filter:['del', 's'],
      replacement:(content, node, options) =>{
            return '~~' + content + '~~'
        }
    })

    //下划线
    this.turndownService.addRule('md-font-underline',{
      filter:'u',
      replacement:(content, node, options) =>{
            return '<u>' + content + '</u>'
        }
    })    

  }

  initTableRule(){
    this.turndownService.addRule('md-table',{
      filter:['table'],
        replacement:(content, node, options) =>{
          let table = node as HTMLElement

            return "这是table"
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