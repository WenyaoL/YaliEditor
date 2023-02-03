import type Token from "markdown-it/lib/token";
import type Renderer from "markdown-it/lib/renderer";
import { escapeHtml } from "markdown-it/lib/common/utils"
import type StateInline from "markdown-it/lib/rules_inline/state_inline";
import type StateBlock from "markdown-it/lib/rules_block/state_block";
import type MarkdownIt from "markdown-it";
// fences (---)

function metaBlock(state: StateBlock, startLine: number, endLine: number, silent: boolean) {
    var marker, len, params, nextLine, mem, token, markup,
        haveEndMarker = false,
        pos = state.bMarks[startLine] + state.tShift[startLine],
        max = state.eMarks[startLine];



    
    //不是第一行或者整个文本只有一行
    if (startLine !== 0 || state.lineMax == 1) { return false; }
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

    if (pos + 3 > max) { return false; }

    marker = state.src.charCodeAt(pos);

    if (marker !== 45/* - */) {
        return false;
    }

    // scan marker length
    mem = pos;
    pos = state.skipChars(pos, marker);

    len = pos - mem;

    if (len < 3) { return false; }

    markup = state.src.slice(mem, pos);
    params = state.src.slice(pos, max);

    if (marker === 45 /* - */) {
        if (params.indexOf(String.fromCharCode(marker)) >= 0) {
            return false;
        }
    }

    // Since start is found, we can report success here in validation mode
    if (silent) { return true; }

    // search end of block
    nextLine = startLine;

    for (; ;) {
        nextLine++;
        if (nextLine >= endLine) {
            // unclosed block should be autoclosed by end of document.
            // also block seems to be autoclosed by end of parent
            break;
        }

        pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];

        if (pos < max && state.sCount[nextLine] < state.blkIndent) {
            // non-empty line with negative indent should stop the list:
            // - ---
            //  test
            break;
        }

        if (state.src.charCodeAt(pos) !== marker) { continue; }

        if (state.sCount[nextLine] - state.blkIndent >= 4) {
            // closing fence should be indented less than 4 spaces
            continue;
        }

        pos = state.skipChars(pos, marker);

        // closing code fence must be at least as long as the opening one
        if (pos - mem < len) { continue; }

        // make sure tail has spaces only
        pos = state.skipSpaces(pos);

        if (pos < max) { continue; }

        haveEndMarker = true;
        // found!
        break;
    }

    // If a fence has heading spaces, they should be removed from its inner block
    len = state.sCount[startLine];

    state.line = nextLine + (haveEndMarker ? 1 : 0);

    token = state.push('mete_block', 'pre', 0);
    token.info = params;
    token.content = state.getLines(startLine + 1, nextLine, len, true);
    token.markup = markup;
    token.map = [startLine, state.line];

    return true;


};

function renderMetaBlock(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer){
    const token = tokens[idx]
    token.attrPush(["markup",token.markup])
    token.attrPush(["md-block","meta"])
    const pre = slf.renderToken(tokens, idx, env)
    return `${pre}${escapeHtml(token.content)}</pre>`
}


export default function (md:MarkdownIt) {
    //在规则前面加
    md.block.ruler.before("code", "meta-block", metaBlock)

    md.renderer.rules.mete_block = renderMetaBlock
}