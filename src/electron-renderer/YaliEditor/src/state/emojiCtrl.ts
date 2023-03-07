import rangy from "rangy"
import YaLiEditor from ".."
import EditorTool from "../tool/EditorTool"
import { strToElement } from "../util/createElement"
import { isMdInlineEmoji, isMdInlineImg, isMdLikeEmoji } from "../util/inspectElement"

function likeEmojiArrowMove(mdBlock: HTMLElement, mdInline, event: KeyboardEvent) {
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


const emojiCtrl = IRState => {

    IRState.prototype.emojiDelete = function (mdBlock, mdInline:HTMLElement) {
        const editorTool = (this.editor.editorTool as EditorTool)
        if(isMdLikeEmoji(mdInline)){
            if(mdInline.textContent.length == 1){ 
                editorTool.hidenEmojiSuggestions()
                editorTool.suggestionPopper.clearData()
                mdInline.remove() 
                return true
            }
            
        }
        return false
    }

    IRState.prototype.emojiEnter = function (mdBlock, mdInline, event) {
        const sel = rangy.getSelection()
        const r = sel.getRangeAt(0)
        const editorTool = (this.editor.editorTool as EditorTool)
        if(isMdLikeEmoji(mdInline)){
            editorTool.hidenSuggestionPopper()
            let emojiName = editorTool.suggestionPopper.activateElement?.querySelector(".emoji-markup").textContent
            
            if (!emojiName) return false
            const emoji = this.likeEmojiTransform(mdInline, emojiName)
            r.collapseAfter(emoji)
            sel.setSingleRange(r)
            return true
        }
        return false
    }

    IRState.prototype.emojiInput = function (mdBlock, mdInline, event) {
        const sel = rangy.getSelection()
        const editor = (this.editor as YaLiEditor)

        if (isMdLikeEmoji(mdInline)) {
            if (!editor.editorTool.suggestionPopper.floatInstance || editor.editorTool.suggestionPopper.floatElement != mdInline) {
                editor.editorTool.suggestionPopper.createSuggestionPopper(mdInline)
            }
            const emojiName = mdInline.textContent as string
            editor.editorTool.showEmojiSuggestions(emojiName.replaceAll(":", ''))
            return true
        }

        const r = sel.getRangeAt(0)
        const mark = r.getBookmark(mdBlock)
        const expectLength = mdBlock.textContent.length
        const emoji = this.emojiRefresh(mdBlock, mdInline) as Node

        if (mdBlock.textContent.length != expectLength) {
            const bias = mdBlock.textContent.length - expectLength
            mark.end = mark.end + bias
            mark.start = mark.start + bias
        }
        r.moveToBookmark(mark)
        sel.setSingleRange(r)
        return true
    }

    IRState.prototype.emojiRefresh = function (mdBlock, mdInline) {
        if (!isMdInlineEmoji(mdInline)) return false;
        mdInline = this.editor.markdownTool.reRenderInlineElement(mdInline) as HTMLElement
        if (!mdInline) return false
        return mdInline
    }

    IRState.prototype.likeEmojiTransform = function (mdInline: HTMLElement, emojiName: string) {

        
        emojiName = `:${emojiName}:`
        const editor = (this.editor as YaLiEditor)
        const emojiInline = strToElement(editor.markdownTool.renderInline(emojiName))
        if (!emojiInline) return mdInline
        mdInline.replaceWith(emojiInline)
        return emojiInline
    }

    IRState.prototype.emojiArrowMove = function (mdBlock: HTMLElement, mdInline, event) {
        if (isMdLikeEmoji(mdInline)) likeEmojiArrowMove.call(this,mdBlock,mdInline,event)
    }
}

export default emojiCtrl