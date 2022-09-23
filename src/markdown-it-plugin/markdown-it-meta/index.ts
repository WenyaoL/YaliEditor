import type MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token";
import type Renderer from "markdown-it/lib/renderer";
import {escapeHtml} from "markdown-it/lib/common/utils"
import type StateInline from "markdown-it/lib/rules_inline/state_inline";
import type StateBlock from "markdown-it/lib/rules_block/state_block";
import { def } from "@vue/shared";




function codeInline(tokens:Token[], idx:number, options:Object, env:Object, slf: Renderer):string{
    var token = tokens[idx];
    const mdTypeAttrs = 'md-inline="code"'
    return  '<code' + slf.renderAttrs(token) +" " + mdTypeAttrs + '>' +
            escapeHtml(tokens[idx].content) +
            '</code>';
}

function codeBlock (tokens:Token[], idx:number, options:Object, env:Object, slf: Renderer) {
    var token = tokens[idx];
    const mdTypeAttrs = 'md-block="code"'
    return  '<pre' + slf.renderAttrs(token) + " " + mdTypeAttrs +'><code>' +
            escapeHtml(tokens[idx].content) +
            '</code></pre>\n';
  };



function strongOpen(tokens:Token[], idx:number, options:Object, env:Object, slf: Renderer){
    const token = tokens[idx]
    const mdTypeAttrs = 'strong'
    token.attrPush(["md-inline",mdTypeAttrs])
    return slf.renderToken(tokens, idx, options);
}

function emOpen(tokens:Token[], idx:number, options:Object, env:Object, slf: Renderer){
    const token = tokens[idx]
    const mdTypeAttrs = 'em'
    token.attrPush(["md-inline",mdTypeAttrs])
    return slf.renderToken(tokens, idx, options);
}

function paragraphOpen(tokens:Token[], idx:number, options:Object, env:Object, slf: Renderer){
  const token = tokens[idx]
  token.attrPush(["md-block","paragraph"])
  return slf.renderToken(tokens, idx, options);
}

function blockquoteOpen(tokens:Token[], idx:number, options:Object, env:Object, slf: Renderer){
    const token = tokens[idx]
    token.attrPush(["md-block","blockquote"])
    return slf.renderToken(tokens, idx, options);
}

function plugin(md: MarkdownIt, options: any) {
    md.renderer.rules.code_inline = codeInline;
    md.renderer.rules.code_block = codeBlock;
    md.renderer.rules.strong_open = strongOpen;
    md.renderer.rules.em_open = emOpen;
    md.renderer.rules.paragraph_open = paragraphOpen;
    md.renderer.rules.blockquote_open = blockquoteOpen;
}

export default plugin;