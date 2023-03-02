import type MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token";
import type Renderer from "markdown-it/lib/renderer";
import { getUniqueKey } from "../markdown-it-key-generator";


function paragraphOpen(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    const token = tokens[idx]
    if (env['generateId']) token.attrPush(["mid", getUniqueKey() + ""])
    token.attrPush(["class", ""])
    token.attrPush(["md-block", "paragraph"])
    return slf.renderToken(tokens, idx, options);
}

function paragraph(state, startLine, endLine) {
    var content, terminate, i, l, token, oldParentType,
        nextLine = startLine + 1,
        terminatorRules = state.md.block.ruler.getRules('paragraph');

    oldParentType = state.parentType;
    state.parentType = 'paragraph';

    // jump line-by-line until empty one or EOF
    for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
        // this would be a code block normally, but after paragraph
        // it's considered a lazy continuation regardless of what's there
        if (state.sCount[nextLine] - state.blkIndent > 3) { continue; }

        // quirk for blockquotes, this line should already be checked by that rule
        if (state.sCount[nextLine] < 0) { continue; }

        // Some tags can terminate paragraph without empty line.
        terminate = false;
        for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
                terminate = true;
                break;
            }
        }
        if (terminate) { break; }
    }

    content = state.getLines(startLine, nextLine, state.blkIndent, false);

    state.line = nextLine;

    token = state.push('paragraph_open', 'p', 1);
    token.map = [startLine, state.line];

    token = state.push('inline', '', 0);
    token.content = content;
    token.map = [startLine, state.line];
    token.children = [];

    token = state.push('paragraph_close', 'p', -1);

    state.parentType = oldParentType;

    return true;
};


function plugin(md: MarkdownIt, options: any = {}) {
    md.block.ruler.at("paragraph",paragraph)
    md.renderer.rules.paragraph_open = paragraphOpen;

    //md.renderer.rules.text = text;
}

export default plugin;