import type MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token";
import type Renderer from "markdown-it/lib/renderer";
import { escapeHtml } from "markdown-it/lib/common/utils"

function codeBlock(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
    var token = tokens[idx];
    const mdTypeAttrs = 'md-block="code"'
    return '<pre' + slf.renderAttrs(token) + " " + mdTypeAttrs + '><code>' +
        escapeHtml(tokens[idx].content) +
        '</code></pre>\n';
};

function plugin(md: MarkdownIt, options: any = {}) {
    md.renderer.rules.code_block = codeBlock;
}

export default plugin;