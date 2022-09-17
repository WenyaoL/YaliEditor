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

export default highlighter;