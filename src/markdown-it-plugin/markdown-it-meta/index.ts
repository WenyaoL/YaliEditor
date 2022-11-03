import type MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token";
import type Renderer from "markdown-it/lib/renderer";
import {escapeHtml} from "markdown-it/lib/common/utils"
import type StateInline from "markdown-it/lib/rules_inline/state_inline";
import type StateBlock from "markdown-it/lib/rules_block/state_block";




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

function strongClose(tokens:Token[], idx:number, options:Object, env:Object, slf: Renderer){
    return slf.renderToken(tokens, idx, options)+'\u200c';
}

function emOpen(tokens:Token[], idx:number, options:Object, env:Object, slf: Renderer){
    const token = tokens[idx]
    const mdTypeAttrs = 'em'
    token.attrPush(["md-inline",mdTypeAttrs])
    return slf.renderToken(tokens, idx, options);
}
function emClose(tokens:Token[], idx:number, options:Object, env:Object, slf: Renderer){
    return slf.renderToken(tokens, idx, options)+'\u200c';
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

function sOpen(tokens:Token[], idx:number, options:Object, env:Object, slf: Renderer){
    const token = tokens[idx]
    const mdTypeAttrs = 'deleteline'
    token.attrPush(["md-inline",mdTypeAttrs])
    return slf.renderToken(tokens, idx, options);
}

function sClose(tokens:Token[], idx:number, options:Object, env:Object, slf: Renderer){
    return slf.renderToken(tokens, idx, options)+'\u200c';
}

function text(tokens:Token[], idx:number, options:Object, env:Object, slf: Renderer){
    let res = slf.renderInlineAsText(tokens, options,env)
    return '<span md-text="text">'+res+'</span>'
}

function plugin(md: MarkdownIt, options: any = {}) {
    
    if(options.borderModel){
        
    }else{
        md.renderer.rules.code_inline = codeInline;
        md.renderer.rules.code_block = codeBlock;
        md.renderer.rules.strong_open = strongOpen;
        //md.renderer.rules.strong_close = strongClose;
        md.renderer.rules.em_open = emOpen;
        //md.renderer.rules.em_close = emClose;
        md.renderer.rules.paragraph_open = paragraphOpen;
        md.renderer.rules.blockquote_open = blockquoteOpen;
        md.renderer.rules.s_open = sOpen;
    }


    //md.renderer.rules.s_close = sClose;
    //md.renderer.rules.text = text
}

export default plugin;