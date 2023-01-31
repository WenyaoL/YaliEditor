import type MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token";
import type Renderer from "markdown-it/lib/renderer";
import { escapeHtml } from "markdown-it/lib/common/utils"
import type StateInline from "markdown-it/lib/rules_inline/state_inline";
import type StateBlock from "markdown-it/lib/rules_block/state_block";




function codeInline(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer): string {
    var token = tokens[idx];
    const mdTypeAttrs = 'md-inline="code"'
    return '<code' + slf.renderAttrs(token) + " " + mdTypeAttrs + '>' +
        escapeHtml(tokens[idx].content) +
        '</code>';
}

function codeInlineBorderModel(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    var token = tokens[idx];
    const mdTypeAttrs = 'md-inline="code"'
    return '<code' + slf.renderAttrs(token) + " " + mdTypeAttrs + '>' +
        '<span class="md-border">`</span>' +
        escapeHtml(tokens[idx].content) +
        '<span class="md-border">`</span>' +
        '</code>';
}

function codeBlock(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    var token = tokens[idx];
    const mdTypeAttrs = 'md-block="code"'
    return '<pre' + slf.renderAttrs(token) + " " + mdTypeAttrs + '><code>' +
        escapeHtml(tokens[idx].content) +
        '</code></pre>\n';
};



function strongOpenBorderModel(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    const token = tokens[idx]
    const mdTypeAttrs = 'strong'
    token.attrPush(["md-inline", mdTypeAttrs])
    return slf.renderToken(tokens, idx, options) + '<span class="md-border">**</span>';
}

function strongCloseBorderModel(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    return '<span class="md-border">**</span>' + slf.renderToken(tokens, idx, options);
}


function strongOpen(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    const token = tokens[idx]
    const mdTypeAttrs = 'strong'
    token.attrPush(["md-inline", mdTypeAttrs])
    return slf.renderToken(tokens, idx, options);
}

function emOpenBorderModel(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    const token = tokens[idx]
    const mdTypeAttrs = 'em'
    token.attrPush(["md-inline", mdTypeAttrs])
    return slf.renderToken(tokens, idx, options) + '<span class="md-border">*</span>';
}

function emCloseBorderModel(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    return '<span class="md-border">*</span>' + slf.renderToken(tokens, idx, options);
}

function emOpen(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    const token = tokens[idx]
    const mdTypeAttrs = 'em'
    token.attrPush(["md-inline", mdTypeAttrs])
    return slf.renderToken(tokens, idx, options);
}



function paragraphOpen(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    const token = tokens[idx]
    token.attrPush(["md-block", "paragraph"])
    return slf.renderToken(tokens, idx, options);
}

function blockquoteOpen(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    const token = tokens[idx]
    token.attrPush(["md-block", "blockquote"])
    return slf.renderToken(tokens, idx, options);
}

function sOpenBorderModel(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    const token = tokens[idx]
    const mdTypeAttrs = 'deleteline'
    token.attrPush(["md-inline", mdTypeAttrs])
    return slf.renderToken(tokens, idx, options) + '<span class="md-border">~~</span>';
}

function sCloseBorderModel(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    const token = tokens[idx]
    const mdTypeAttrs = 'deleteline'
    token.attrPush(["md-inline", mdTypeAttrs])
    return '<span class="md-border">~~</span>' + slf.renderToken(tokens, idx, options);
}

function sOpen(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    const token = tokens[idx]
    const mdTypeAttrs = 'deleteline'
    token.attrPush(["md-inline", mdTypeAttrs])
    return slf.renderToken(tokens, idx, options);
}



function text(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    let res = slf.renderInlineAsText(tokens, options, env)
    return '<span md-text="text">' + res + '</span>'
}


function hr(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer){
    const token = tokens[idx]
    token.attrPush(["markup",token.markup])
    const hrstr = slf.renderToken(tokens, idx, env)
    return '<div md-block="hr" class="md-hr" contenteditable="false">' + hrstr + '</div>'
}

function plugin(md: MarkdownIt, options: any = {}) {

    md.renderer.rules.hr = hr

    if (options.borderModel) {
        md.renderer.rules.code_inline = codeInlineBorderModel
        md.renderer.rules.code_block = codeBlock;
        
        md.renderer.rules.strong_open = strongOpenBorderModel
        md.renderer.rules.strong_close = strongCloseBorderModel

        md.renderer.rules.em_open = emOpenBorderModel
        md.renderer.rules.em_close = emCloseBorderModel

        md.renderer.rules.s_open = sOpenBorderModel
        md.renderer.rules.s_close = sCloseBorderModel

        md.renderer.rules.paragraph_open = paragraphOpen;
        md.renderer.rules.blockquote_open = blockquoteOpen;
    } else {
        md.renderer.rules.code_inline = codeInline;
        md.renderer.rules.code_block = codeBlock;

        md.renderer.rules.strong_open = strongOpen;
        md.renderer.rules.em_open = emOpen;
        md.renderer.rules.s_open = sOpen;

        md.renderer.rules.paragraph_open = paragraphOpen;
        md.renderer.rules.blockquote_open = blockquoteOpen;
        
    }


    //md.renderer.rules.s_close = sClose;
    //md.renderer.rules.text = text
}

export default plugin;