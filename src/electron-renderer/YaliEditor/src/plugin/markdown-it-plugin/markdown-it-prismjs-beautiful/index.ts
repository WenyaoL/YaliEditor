/**
 * @author liangwenyao
 * @since 2022/10/18
 * @github https://github.com/WenyaoL/YaliEditor
 */

 import Prism from 'prismjs'
 import initLoadLanguage, { loadedLanguages, transformAliasToOrigin } from './loadLanguage'
 import { languages } from 'prismjs/components.js'
 
 const prism = Prism
 window.Prism = Prism
 /* eslint-disable */
 import('prismjs/plugins/keep-markup/prism-keep-markup')
 /* eslint-enable */
 const langs = []
 
 for (const name of Object.keys(languages)) {
   const lang = languages[name]
   langs.push({
     name,
     ...lang
   })
   if (lang.alias) {
     if (typeof lang.alias === 'string') {
       langs.push({
         name: lang.alias,
         ...lang
       })
     } else if (Array.isArray(lang.alias)) {
       langs.push(...lang.alias.map(a => ({
         name: a,
         ...lang
       })))
     }
   }
 }
 
 const loadLanguage = initLoadLanguage(Prism)
 
 // pre load latex and yaml and html for `math block` \ `front matter` and `html block`
 loadLanguage('latex')
 loadLanguage('yaml')

export const prismHighlighter =(str:string,lang:string)=>{
    let preCode = ""
    let lowerCaseLang = lang.toLowerCase()
    //loadLanguages(lowerCaseLang)
    loadLanguage(lowerCaseLang)
    let gammer = Prism.languages[lowerCaseLang]

    //console.log(java);

    if(gammer){
        let html = Prism.highlight(str,gammer,lowerCaseLang)
        html = '<pre class="line-numbers"><code>' + html + '</code></pre>'
        return html
    }
    
    
    return '<pre class="line-numbers"><code>' + str + '</code></pre>'
    
}

export default prismHighlighter