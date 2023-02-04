import type MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token";
import type Renderer from "markdown-it/lib/renderer";

function hr(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer){
    const token = tokens[idx]
    token.attrPush(["markup",token.markup])
    const hrstr = slf.renderToken(tokens, idx, env)
    return '<div md-block="hr" class="md-hr" contenteditable="false">' + hrstr + '</div>'
}

function plugin(md: MarkdownIt, options: any = {}) {
    md.renderer.rules.hr = hr
}

export default plugin;