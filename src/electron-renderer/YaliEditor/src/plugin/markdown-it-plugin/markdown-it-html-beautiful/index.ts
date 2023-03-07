
/**
 * @author liangwenyao
 * @since 2023/1
 */
import type MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import { toImgElementText } from "../util/formatText"
import Reg from '../../../constant/reg'
import { escapeHtml } from "markdown-it/lib/common/utils"
import { EditorState } from "@codemirror/state"
import { v4 as uuidv4 } from 'uuid';
import YaLiEditor from "../../../index";
import { CodemirrorEditorState } from "../markdown-it-codemirror-beautiful/CodemirrorEditorState";
import { html } from '@codemirror/lang-html'
import { myMinimalSetup } from '../../codemirror-plugin/codeStyle/codePlugin'
import { isMdBlockHTML } from "../../../util/inspectElement";
import { getUniqueKey } from "../markdown-it-key-generator";
import {htmlBlockNames,tagOpenReg,tagCloseReg, utagOpenReg,utagCloseReg} from './config';


let editor: YaLiEditor = null


function htmlBlock(tokens: Token[], idx: number, options: Object, env: Object) {
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
        return `<div mid="${getUniqueKey()}" md-block="html-comment" class="html-comment">${comment}</div>`
    }

    const id = uuidv4()
    const extensions = editor.ir.renderer.codemirrorManager.createHtmlBlockPlugin(id)
    
    let editorState = EditorState.create({
        doc: content,
        extensions
    })
    editor.ir.renderer.codemirrorManager.addStateCache(
        new CodemirrorEditorState(
            id,
            editorState,
            {
                needSuggestUI: false,
            }))

    if (env['generateId']) {
        return `<div mid="${getUniqueKey()}" md-block="html" contenteditable="false" class>
        <div class="md-htmlblock-tooltip"><span><i class="el-icon-arrow-down"></i>HTML</span></div>
        <pre id=${id} class="md-htmlblock-container markdown-it-code-beautiful"></pre>
        <div class="md-htmlblock-panel">${content}</div>
        </div>`;
    }

    return `<div md-block="html" contenteditable="false" class>
            <div class="md-htmlblock-tooltip"><span><i class="el-icon-arrow-down"></i>HTML</span></div>
            <pre id=${id} class="md-htmlblock-container markdown-it-code-beautiful"></pre>
            <div class="md-htmlblock-panel">${content}</div>
            </div>`;
};

function htmlInline(tokens: Token[], idx: number, options: Object, env: Object){
    const tag = tokens[idx].content

    if(utagOpenReg.test(tag)) return `<u md-inline="underline"><span class="md-border">${escapeHtml(tag)}</span>`
    if(utagCloseReg.test(tag)) return `<span class="md-border">${escapeHtml(tag)}</span></u>`
    

    if(tagOpenReg.test(tag)){
        return `<span md-inline="html"><span class="md-tag">${escapeHtml(tag)}</span>`
    }
    
    return `<span class="md-tag">${escapeHtml(tag)}</span></span>`
}

export default function plugin(md: MarkdownIt, options: any) {
    editor = options.editor
    editor.ir.applicationEventPublisher.subscribe("focus-change", (oldFocusBlock: HTMLElement, newFocusBlock: HTMLElement) => {
        if (isMdBlockHTML(oldFocusBlock)) {
            const id = oldFocusBlock.querySelector(".markdown-it-code-beautiful")?.id
            oldFocusBlock.querySelector(".md-htmlblock-panel").innerHTML = editor.ir.renderer.codemirrorManager.getTextValue(id)
        }
    })
    md.renderer.rules.html_block = htmlBlock;
    md.renderer.rules.html_inline = htmlInline;
}
