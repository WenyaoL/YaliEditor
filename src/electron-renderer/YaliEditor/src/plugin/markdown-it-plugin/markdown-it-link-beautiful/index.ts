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
function linkOpen(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    const token = tokens[idx]

    let str = ''
    const nextToken = tokens[idx + 1];
    //if nextToken.type == "link_close", then text is []()
    if (nextToken.type == "link_close") {
        str = `<span md-inline="link" md-like="link" spellcheck="false"><span class="md-border md-like">[</span>`
    } else {
        str = `<span md-inline="link" spellcheck="false"><span class="md-border">[</span>`
    }

    token.attrPush(["class", "md-link-a"])
    const aOpen = slf.renderToken(tokens, idx, options);

    return str + aOpen
}

function linkClose(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    let token = tokens[idx - 2]
    let mdClass = "md-hiden"
    const preToken = tokens[idx - 1]
    let str = ''
    //if token.type == "link_open" ,then text is []()
    if (preToken.type == "link_open") {
        str = `<span class="md-border md-like">](</span>`+
        `<span class="md-like md-link-url md-meta">${preToken.attrGet("href")}</span>` +
        `<span class="md-border md-like">)</span>`+
        `</span>`
    }else{
        str = `<span class="md-border">](</span>`+
        `<span class="md-hiden md-link-url md-meta">${tokens[idx - 2].attrGet("href")}</span>` +
        `<span class="md-border">)</span>`+
        `</span>`
    }
    const aClose = slf.renderToken(tokens, idx, options);

    return aClose + str
}

function plugin(md: MarkdownIt, options: any) {
    md.renderer.rules.link_open = linkOpen;
    md.renderer.rules.link_close = linkClose;
}

export default plugin;