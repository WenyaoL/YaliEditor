// Process [toc]

'use strict';

import MarkdownIt from "markdown-it";
import StateBlock from "markdown-it/lib/rules_block/state_block";
import StateCore from "markdown-it/lib/rules_core/state_core";
import Token from "markdown-it/lib/token";




export default function(md:MarkdownIt) {

    var TOC_REGEXP = /@?\[toc\](?:\((?:\s+)?([^\)]+)(?:\s+)?\)?)?(?:\s+?)?$/im;
    var TOC_DEFAULT = 'Table of Contents';
    var gstate:StateCore;
    let found:boolean = false;

    function toc(state: StateBlock,startLine: number,endLine: number,silent: boolean) 
    {
        let pos = state.bMarks[startLine] + state.tShift[startLine],
            max = state.eMarks[startLine];
        
        
        // trivial rejections
        if (state.src.charCodeAt(pos) !== 0x5B /* [ */  && state.src.charCodeAt(pos)!== 0x40 /*@*/) {
            return false;
        }

        let token:Token;
        let content = state.src.substring(pos,max)
        console.log(content);
        
        //查找
        var match:RegExpExecArray|string[] = TOC_REGEXP.exec(content);
        
        if (!match) {
            return false;
        }
        console.log(match);
        
        match = match.filter(function(m) {
            return m;
        });
        if (match.length < 1) {
            return false;
        }
        if (silent) { // don't run any pairs in validation mode
            return false;
        }

        token = state.push('toc_open', 'toc', 1);
        token.markup = '[toc]';

        token = state.push('toc_body', '', 0);
        var label = TOC_DEFAULT;
        if (match.length >= 1) {
            label = match.pop();
        }
        token.content = label;

        token = state.push('toc_close', 'toc', -1);

        state.line++
        //标志为找到，避免重复寻找
        found=true
        return true;
    }




    var makeSafe = function(label:string) {
        return label.replace(/[^\w\s]/gi, '').split(' ').join('_');
    };

    function getHeadingClass(indent){
        return 'md-toc-h'+indent
    }

    //change heading_open rules
    md.renderer.rules.heading_open = function(tokens, index,options, env, slf) {
        const token = tokens[index]
        var label = tokens[index + 1];
        const attrs = makeSafe(label.content) + '_' + label.map[0]
        token.attrPush(["id",attrs])
        const mdTypeAttrs = 'heading'
        token.attrPush(["md-block",mdTypeAttrs])
        return slf.renderToken(tokens, index, options);
    };

    md.renderer.rules.toc_open = function(tokens, index) {
        return '<div class="markdown-it-toc-beautiful" md-block="toc" contenteditable="false">';
    };

    md.renderer.rules.toc_close = function(tokens, index) {
        return '</div>';
    };

    md.renderer.rules.toc_body = function(tokens, index) {
        // Wanted to avoid linear search through tokens here, 
        // but this seems the only reliable way to identify headings

        var headings = [];
        var gtokens = gstate.tokens;
        var size = gtokens.length;
        //获取标题
        for (var i = 0; i < size; i++) {
            if (gtokens[i].type !== 'heading_close') {
                continue;
            }
            var token = gtokens[i];
            var heading = gtokens[i - 1];
            
            if (heading.type === 'inline') {
                headings.push({
                    level: +token.tag.substr(1, 1),
                    anchor: makeSafe(heading.content) + '_' + heading.map[0],
                    content: heading.content
                });
            }
        }
        let res = []

        //处理toc-tip
        
        let svg = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa=""><path fill="currentColor" d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V256zm448-64v-64H416v64h192zM224 896h576V256H224v640zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32zm192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32z"></path></svg>'
        //svg = '<i class="el-icon-delete"></i>'
        let tip ='<div class="md-toc-tip">'+'<span>目录</span><button class="toc-delete" onclick="TOC_DELETE()"><span>'+svg+'</button></span></div>';
        res.push(tip)

        //处理缩进
        var list = headings.map(heading => {
            var indent = heading.level
            var item = [];
            item = item.concat([
            '<span class="',getHeadingClass(indent),' md-toc-item ">'
            ,'<a to-href="', heading.anchor, '">', heading.content, 
            '</a></span>'])
            return item.join('');
        });
        let content = "<p>"+list.join('')+"</p>"

        res.push(content)
        return res.join('')
    };

    md.core.ruler.push('grab_state', function(state) {
        gstate = state;
        //重置标志
        found=false
    });

    //md.inline.ruler.after('emphasis', 'toc', toc);
    //md.block.ruler.before('paragraph','toc',toc)
    md.block.ruler.before('paragraph','toc',toc)

    document.addEventListener("click",(event:MouseEvent &{target:Element})=>{
        //如果点击的是目录
        if(event.target.tagName == "A" && event.target.hasAttribute("to-href")){
            let href = event.target.getAttribute("to-href")
            document.getElementById(href).scrollIntoView({behavior: "smooth"})
            }
    })

    const win:any = window
    win.TOC_DELETE=()=>{
        let toc = document.getElementsByClassName("markdown-it-toc-beautiful").item(0)
        if(toc) toc.remove()
    }

};