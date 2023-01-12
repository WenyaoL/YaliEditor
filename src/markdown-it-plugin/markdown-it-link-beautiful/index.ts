/**
 * @author liangwenyao
 * @since 2022/8/15
 */
import type MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token";
import type Renderer from "markdown-it/lib/renderer";


/**
 * 链接open标签渲染
 * @param tokens 
 * @param idx 
 * @param options 
 * @param env 
 * @param slf 
 * @returns 
 */
function linkOpen(tokens:Token[], idx:number, options:Object, env:Object, slf: Renderer){
    const token = tokens[idx]

    let root = document.createElement("span")

    //if nextToken.type == "link_close", then text is []()
    const nextToken = tokens[idx+1];
    if(nextToken.type == "link_close"){
        root.setAttribute("md-inline","link")
        root.setAttribute("md-like","link")
        root.setAttribute("spellcheck","false")
        let pre = document.createElement("span")
        pre.innerText = "["
        pre.classList.add("md-like")
        root.appendChild(pre)
    }else{
        root.setAttribute("md-inline","link")
        root.setAttribute("spellcheck","false")
        let pre = document.createElement("span")
        pre.innerText = "["
        pre.classList.add("md-hiden")
        root.appendChild(pre)
    }



    let html = root.outerHTML
    //移除</span>
    html = html.substring(0,html.length-7);
    token.attrPush(["class","md-link-a"])
    const aOpen = slf.renderToken(tokens, idx, options);

    return html + aOpen
}

function linkClose(tokens:Token[], idx:number, options:Object, env:Object, slf: Renderer){
    let token = tokens[idx-2]
    let mdClass = "md-hiden"

    //if token.type !== "link_open" ,then text is []()
    if(!token ||token.type !== "link_open"){        
        token = tokens[idx-1];
        mdClass = "md-like"
    }

    let root = document.createElement("span")
    let mid = document.createElement("span")
    mid.innerText = "]("
    mid.classList.add(mdClass)
    let url = document.createElement("span")
    url.innerText = token.attrGet("href")
    url.classList.add(mdClass)
    url.classList.add("md-link-url")
    url.classList.add("md-meta")

    let suf = document.createElement("span")
    suf.innerText = ")"
    suf.classList.add(mdClass)
    root.appendChild(mid)
    root.appendChild(url)
    root.appendChild(suf)
    let html = root.outerHTML
    //移除<span>
    html = html.substring(6,html.length)

    const aClose = slf.renderToken(tokens, idx, options);


    return aClose + html
}

function plugin(md: MarkdownIt, options: any){
    md.renderer.rules.link_open = linkOpen;
    md.renderer.rules.link_close = linkClose;
}

export default plugin;