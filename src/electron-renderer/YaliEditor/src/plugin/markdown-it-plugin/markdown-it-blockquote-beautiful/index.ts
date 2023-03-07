import type MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token";
import type Renderer from "markdown-it/lib/renderer";
import { getUniqueKey } from "../markdown-it-key-generator";

function blockquoteOpen(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    const token = tokens[idx]
    if (env['generateId']) token.attrPush(["mid", getUniqueKey() + ""])
    token.attrPush(["md-block", "blockquote"])
    return slf.renderToken(tokens, idx, options);
}


function plugin(md: MarkdownIt, options: any = {}) {
    md.renderer.rules.blockquote_open = blockquoteOpen;
}

export default plugin