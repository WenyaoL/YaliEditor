import YaLiEditor from ".."
import constants from "../constant/constants"
import { strToElement } from "../util/createElement"
import { isMdBlockFence, isMdLikeFence } from "../util/inspectElement"
import rangy from 'rangy'
import EditorTool from "../tool/EditorTool"


function fenceArrowMove(mdBlock: HTMLElement, mdInline, event) {
    const sel = rangy.getSelection()

    switch (event.key) {
        case "ArrowUp": {
            let r = sel.getRangeAt(0)
            const preSibling = mdBlock.previousElementSibling
            let viewInfo = this.editor.ir.renderer.codemirrorManager.getViewInfo(mdBlock.id)
            let pos = viewInfo.view.posAtDOM(r.startContainer, r.startOffset)
            let blockInfo = viewInfo.view.lineBlockAt(pos)
            if (blockInfo.top == 0) {
                //兄弟节点
                if (!preSibling) return false
                r.collapseToPoint(preSibling, preSibling.childNodes.length)
                sel.setSingleRange(r)
                return true
            }
            break;
        }
        case "ArrowDown": {
            let r = sel.getRangeAt(0)
            const nextSibling = mdBlock.nextElementSibling
            let viewInfo = this.editor.ir.renderer.codemirrorManager.getViewInfo(mdBlock.id)
            let pos = viewInfo.view.posAtDOM(r.startContainer, r.startOffset)
            let length = viewInfo.view.state.doc.length
            let blockInfo = viewInfo.view.lineBlockAt(pos)

            if (blockInfo.from + blockInfo.length == length) {
                //兄弟节点
                if (!nextSibling) return false
                r.collapseToPoint(nextSibling, nextSibling.childNodes.length)
                sel.setSingleRange(r)
                return true
            }
            break;
        }
    }

    return false
}

function likeFenceArrowMove(mdBlock: HTMLElement, mdInline, event: KeyboardEvent) {
    const editor = (this.editor as YaLiEditor)
    switch (event.key) {
        case "ArrowUp": {
            editor.editorTool.suggestionPopper.moveActiveItem(editor.editorTool.suggestionPopper.activateIndex - 1)
            break;
        }
        case "ArrowDown": {
            editor.editorTool.suggestionPopper.moveActiveItem(editor.editorTool.suggestionPopper.activateIndex + 1)
            break;
        }
    }

    event.preventDefault()
    return true

}


const fenceCtrl = IRState => {

    IRState.prototype.fenceDelete = function (mdBlock) {

        return false
    }

    IRState.prototype.fenceEnter = function (mdBlock: HTMLElement) {
        const editorTool = (this.editor.editorTool as EditorTool)
        if (isMdBlockFence(mdBlock) && mdBlock.hasAttribute(constants.ATTR_MD_LIKE)) {
            //创建代码块
            let lang = editorTool.suggestionPopper.activateElement?.textContent
            if (!lang) lang = mdBlock.textContent.substring(3)
            this.likeFencetransform(mdBlock, lang)
            return true
        }

        return false
    }

    IRState.prototype.fenceInput = function (mdBlock: HTMLElement, mdInline, event) {
        const editor = (this.editor as YaLiEditor)
        if (isMdBlockFence(mdBlock) && isMdLikeFence(mdBlock)) {

            const sel = rangy.getSelection()
            const r = sel.getRangeAt(0)
            const mark = r.getBookmark(mdBlock) as any
            mdBlock = editor.markdownTool.reRenderBlockElement(mdBlock) as any
            if (!mdBlock) return false
            mark.containerNode = mdBlock
            r.moveToBookmark(mark)
            sel.setSingleRange(r)
            editor.ir.focueProcessor.updateFocusMdBlockByStart(r.startContainer)
            if(!isMdLikeFence(mdBlock)){ 
                editor.editorTool.suggestionPopper.hidenSuggestionPopper()
                editor.editorTool.suggestionPopper.clearData()
                return false
            }

            if (!editor.editorTool.suggestionPopper.floatInstance || editor.editorTool.suggestionPopper.floatElement != mdBlock) {
                editor.editorTool.suggestionPopper.createSuggestionPopper(mdBlock)
            }
            editor.editorTool.showLangSuggestions(mdBlock.querySelector(".lang").textContent)

        }
        return true
    }

    IRState.prototype.fenceArrowMove = function (mdBlock: HTMLElement, mdInline, event) {


        if (!isMdBlockFence(mdBlock)) return

        if (isMdLikeFence(mdBlock)) return likeFenceArrowMove.call(this, mdBlock, mdInline, event)
        else {
            return fenceArrowMove.call(this, mdBlock, mdInline, event)
        }
    }


    IRState.prototype.likeFencetransform = function (mdBlock: HTMLElement, lang: string) {
        const editorTool = (this.editor.editorTool as EditorTool)
        if (!lang) lang = ''
        editorTool.hidenSuggestionPopper()
        const res = this.editor.ir.renderer.render("```" + lang + "\n```")
        const codeBlock = strToElement(res)

        const fence = this.editor.markdownTool.replaceMdBlockFence(mdBlock, codeBlock) as HTMLElement

        this.editor.ir.renderer.refreshStateCache(this.editor.ir.rootElement)

        //锁定为聚焦元素
        this.editor.ir.focueProcessor.setFocusElementByMdblock(fence as HTMLElement)
        this.editor.ir.renderer.codemirrorManager.viewFocus(fence.id)
        this.editor.ir.renderer.codemirrorManager.mountInputComponent(fence.id)

        this.editor.ir.observer.forceFlush()
        return fence
    }
}

export default fenceCtrl