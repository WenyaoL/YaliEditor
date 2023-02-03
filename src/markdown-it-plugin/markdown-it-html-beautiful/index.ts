
/**
 * @author liangwenyao
 * @since 2023/1
 */
import type MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import Renderer from "markdown-it/lib/renderer";
import { toImgElementText } from "../util/formatText"
import Reg from '../../YaliEditor/src/constant/reg'
import { escapeHtml } from "markdown-it/lib/common/utils"

function htmlBlock(tokens: Token[], idx: number /*, options, env */) {
    const token = tokens[idx];
    const content = tokens[idx].content

    //适配图片
    if (token.content.startsWith("<img")) {
        const p = document.createElement("p")
        p.setAttribute("md-inline", "paragraph")

        const root = document.createElement("span")
        root.classList.add("md-image")

        root.setAttribute("md-inline", "img")

        const span = document.createElement("span")
        span.classList.add("md-hiden")


        root.appendChild(span)
        //将字符串解析为element,并插入到第一个孩子前面
        root.insertAdjacentHTML("beforeend", token.content)
        const src = root.children[1].getAttribute("src")

        span.innerHTML = toImgElementText(src, src)

        p.appendChild(root)
        return p.outerHTML
    }


    //适配HTML注解元素
    if (Reg.htmlcommentReg.test(content)) {
        const comment = escapeHtml(content)
        return `<div md-block="html-comment" class="html-comment">${comment}</div>`
    }


    return `<div md-block="html">
            <div class="md-htmlblock-tooltip" contenteditable="false"><span><i class="el-icon-arrow-down"></i>HTML</span></div>
            <div class="md-htmlblock-container"></div>
            <div class="md-htmlblock-panel" contenteditable="false">${content}</div>
            </div>`;
};

export default function plugin(md: MarkdownIt, options: any) {

    md.renderer.rules.html_block = htmlBlock;
}
