import TurndownService from 'turndown';


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
  filter:function (node, options) {
    let flag = (
      node.nodeName === 'SPAN' &&
      node.hasAttribute("md-inline","img")
    )
    return flag;
    },
    replacement:(content, node, options) =>{
        node.firstElementChild.textContent
        return node.firstElementChild.textContent
    }
})


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

export default turndownService;