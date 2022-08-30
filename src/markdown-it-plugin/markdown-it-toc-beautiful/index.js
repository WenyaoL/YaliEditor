// Process [toc]

'use strict';

import Token from "markdown-it/lib/token";

export default function(md) {

    var TOC_REGEXP = /@?\[toc\](?:\((?:\s+)?([^\)]+)(?:\s+)?\)?)?(?:\s+?)?$/im;
    var TOC_DEFAULT = 'Table of Contents';
    var gstate;

    function toc(state, silent) {
        //console.log("state===>",state);
        //存在换行符，并且换行符在[toc]前面
        /*while (state.src.indexOf('\n') >= 0 && state.src.indexOf('\n') < state.src.indexOf('[toc]')) {
            
            if (state.tokens.slice(-1)[0].type === 'softbreak') {
                state.src = state.src.split('\n').slice(1).join('\n');
                state.pos = 0;
            }
        }*/
        var token;

        // trivial rejections
        //if (state.src.charCodeAt(state.pos) !== 0x5B /* [ */ ) {
        //    return false;
        //}

        
        var match = TOC_REGEXP.exec(state.src);

        
        if (!match) {
            return false;
        }
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
        if (match.length > 1) {
            label = match.pop();
        }
        token.content = label;

        token = state.push('toc_close', 'toc', -1);

        var offset = 0;
        var newline = state.src.indexOf('\n');
        if (newline !== -1) {
            offset = state.pos + newline;
        } else {
            offset = state.pos + state.posMax + 1;
        }
        state.pos = offset;

        return true;
    }


    var makeSafe = function(label) {
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
        return '<div class="markdown-it-toc-beautiful" contenteditable="false">';
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
        let tip ='<div class="md-toc-tip">'+'<span>目录</span>'+'</div>';
        res.push(tip)

        //处理缩进
        var list = headings.map(heading => {
            var indent = heading.level
            var item = [];
            item = item.concat([
            '<span class="',getHeadingClass(indent),' md-toc-item ">'
            ,'<a href="#', heading.anchor, '">', heading.content, 
            '</a></span>'])
            return item.join('');
        });
        let content = "<p>"+list.join('')+"</p>"

        res.push(content)
        return res.join('')
    };

    md.core.ruler.push('grab_state', function(state) {
        gstate = state;
    });

    md.inline.ruler.after('emphasis', 'toc', toc);
};