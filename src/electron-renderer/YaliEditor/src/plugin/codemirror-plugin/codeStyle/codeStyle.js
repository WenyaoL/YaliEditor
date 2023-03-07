/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import hljs from 'highlight.js';

// 引入默认样式
//import 'highlight.js/scss/default.scss'
// 引入个性化的vs2015样式
//import 'highlight.js/styles/vs2015.css'





export const highlighter = (str,lang)=>{
    if (lang && hljs.getLanguage(lang)) {

        let preCode =  hljs.highlight(str, {language: lang,ignoreIllegals: true}).value
        //const preCode = hljs.highlight(str,{language:lang,ignoreIllegals:true}).value

        let html = '<pre class="hljs">'
        //长度
        let length =  preCode.split(/\n/).length
        let li = ''
        //生成列表
        for (let index = 1; index < length; index++) {
          li = li + '<li style="color: rgb(153, 153, 153);">'+ index + '</li>'
        }
        html = html + "<ul>" + li+ "</ul>"
        html = html + '<code class="language-'+lang+'">' + preCode +'</code></pre>'
        return html
    }

    return '<pre class="hljs"><code>' +str +'</code></pre>'
}




export const lineHighlighter = (str, lang)=>{
    // 此处判断是否有添加代码语言
  if (lang && hljs.getLanguage(lang)) {
    try {
        // 得到经过highlight.js之后的html代码
      console.log(str);
      const preCode = hljs.highlight(lang, str, true).value
      console.log(preCode);
      // 以换行进行分割
      const lines = preCode.split(/\n/).slice(0, -1)

      // 添加自定义行号
      let html = lines.map((item, index) => {
        return '<li><span class="line-num" data-line="' + (index + 1) + '"></span>' + item + '</li>'
      }).join('')

      html = '<ol>' + html + '</ol>'
      // 添加代码语言
      if (lines.length) {
        html += '<b class="name">' + lang + '</b>'
      }
      return '<pre class="hljs"><code>' + html +'</code></pre>'
    } catch (__) {}
  }
  // 未添加代码语言，此处与上面同理
  const preCode = md.utils.escapeHtml(str)
  const lines = preCode.split(/\n/).slice(0, -1)
  let html = lines.map((item, index) => {
    return '<li><span class="line-num" data-line="' + (index + 1) + '"></span>' + item + '</li>'
  }).join('')
  html = '<ol>' + html + '</ol>'
  return '<pre class="hljs"><code>' +html +'</code></pre>'
}