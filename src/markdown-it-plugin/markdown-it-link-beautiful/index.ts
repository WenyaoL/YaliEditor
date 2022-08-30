import type MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token";
import type Renderer from "markdown-it/lib/renderer";

function linkOpen(tokens:Token[], idx:number, options:Object, env:Object, slf: Renderer){
    const token = tokens[idx]

    let root = document.createElement("span")
    root.setAttribute("md-inline","link")
    root.setAttribute("spellcheck","false")
    let pre = document.createElement("span")
    pre.innerText = "["
    pre.classList.add("md-hiden")
    root.appendChild(pre)

    let html = root.outerHTML
    //移除</span>
    html = html.substring(0,html.length-7);
    token.attrPush(["class","md-link-a"])
    const aOpen = slf.renderToken(tokens, idx, options);

    return html + aOpen
}

function linkClose(tokens:Token[], idx:number, options:Object, env:Object, slf: Renderer){
    let token = tokens[idx-2]
    if(token.type !== "link_open"){        
        token = tokens[idx-1];
    }

    let root = document.createElement("span")
    let mid = document.createElement("span")
    mid.innerText = "]("
    mid.classList.add("md-hiden")
    let url = document.createElement("span")
    url.innerText = token.attrGet("href")
    url.classList.add("md-hiden")
    url.classList.add("md-link-url")
    url.classList.add("md-meta")

    let suf = document.createElement("span")
    suf.innerText = ")"
    suf.classList.add("md-hiden")
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