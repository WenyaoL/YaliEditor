/**
 * @author liangwenyao
 * @since 2022/8/20
 */
import hljs from 'highlight.js';
// 引入默认样式
//import 'highlight.js/scss/default.scss'
// 引入个性化的vs2015样式
//import 'highlight.js/styles/vs2015.css'
export const highlighter = (str:string,lang:string)=>{
  let preCode = ""
  if (lang && hljs.getLanguage(lang)) {
    preCode =  hljs.highlight(str, {language: lang,ignoreIllegals: true}).value
  }
  //const preCode = hljs.highlight(str,{language:lang,ignoreIllegals:true}).value

  let html = '<pre class="hljs">'
  //长度
  let length = 0;
  if(preCode) length =  preCode.split(/\n/).length
  else length = str.split(/\n/).length
  
  let li = ''
  //生成列表
  for (let index = 1; index < length; index++) {
    li = li + '<li style="color: rgb(153, 153, 153);">'+ index + '</li>'
  }
  html = html + "<ul>" + li+ "</ul>"

  if(preCode){
    html = html + '<code class="language-'+lang+'">' + preCode +'</code></pre>'
  }else{
    html = html + '<code>' + str +'</code></pre>'
  }

  return html
}

export default highlighter;