import type MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token";
import type Renderer from "markdown-it/lib/renderer";
import { getUniqueKey } from "../markdown-it-key-generator";

function hr(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer){
    const token = tokens[idx]
    token.attrPush(["markup",token.markup])
    const hrstr = slf.renderToken(tokens, idx, env)
    if(env['generateId']) return `<div mid="${getUniqueKey()}" md-block="hr" class="md-hr" contenteditable="false">` + hrstr + '</div>'
    return '<div md-block="hr" class="md-hr" contenteditable="false">' + hrstr + '</div>'
}

function plugin(md: MarkdownIt, options: any = {}) {
    md.renderer.rules.hr = hr
}

export default plugin;