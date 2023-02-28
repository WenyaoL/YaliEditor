import YaLiEditor from '..'
import Constants from "../constant/constants";
import Reg from '../constant/reg';
import {
    isMdBlockCode,
    isMdBlockFence,
    isMdBlockHeading,
    isMdBlockHTML,
    isMdBlockMath,
    isMdBlockMeta,
    isMdBlockParagraph,
    isMdInlineEmoji,
    isMdInlineFont,
    isMdInlineImg,
    isMdInlineLink
} from '../util/inspectElement';

class IRInputProcessor {

    //编辑器
    public editor: YaLiEditor;

    constructor(editor: YaLiEditor) {
        this.editor = editor
    }

    /**
     * 刷新渲染
     */
    execute(event: InputEvent) {

        this.editor.ir.focueProcessor.updateBookmark()

        //一般打字不处理
        if (event.isComposing) {
            return;
        }

        const mdBlock = this.editor.ir.focueProcessor.selectedBlockMdElement
        const mdInline = this.editor.ir.focueProcessor.selectedInlineMdElement
        //根据输入位置发布不同的事件
        if (isMdBlockHeading(mdBlock)) {
            this.editor.ir.applicationEventPublisher.AsynPublish(Constants.IR_EVENT_REFRESHTOC)
        }

        if (isMdInlineLink(mdInline) && this.editor.ir.state.linkInput(mdBlock, mdInline)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdInlineImg(mdInline) && this.editor.ir.state.imgInput(mdBlock, mdInline)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdInlineFont(mdInline) && this.editor.ir.state.fontInput(mdBlock, mdInline)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdInlineEmoji(mdInline) && this.editor.ir.state.emojiInput(mdBlock, mdInline)) {
            this.editor.ir.observer.flush()
            return true
        }



        if (isMdBlockParagraph(mdBlock) && this.editor.ir.state.paragraphInput(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdBlockHeading(mdBlock) && this.editor.ir.state.headingInput(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdBlockFence(mdBlock) && this.editor.ir.state.fenceInput(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdBlockMath(mdBlock) && this.editor.ir.state.mathBlockInput(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdBlockHTML(mdBlock) && this.editor.ir.state.htmlBlockInput(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdBlockMeta(mdBlock) && this.editor.ir.state.metaBlockInput(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        } else if (isMdBlockCode(mdBlock) && this.editor.ir.state.codeBlockInput(mdBlock, mdInline, event)) {
            this.editor.ir.observer.flush()
            return true
        }

        this.editor.ir.observer.flush()

    }

}

export default IRInputProcessor