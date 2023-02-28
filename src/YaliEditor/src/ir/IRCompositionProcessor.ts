import YaliEditor from '../index'
import IR from '.';
import Constants from "../constant/constants";
import { isMdBlockCode, isMdBlockFence, isMdBlockHeading, isMdBlockHTML, isMdBlockMath, isMdBlockMeta, isMdBlockParagraph, isMdInlineEmoji, isMdInlineFont, isMdInlineImg, isMdInlineLink } from '../util/inspectElement';

export class IRCompositionProcessor{
    public editor:YaliEditor;
    public ir:IR;
    public composingLock:boolean = false; //打字锁

    constructor(editor:YaliEditor){
        this.editor = editor
        this.ir = this.editor.ir
    }

    public compositionStart(event: CompositionEvent & { target: HTMLElement }){
        //if(event.target.classList.contains("cm-content")) return
        this.editor.ir.focueProcessor.updateBeforeModify()
        //上锁，代表在用打字
        this.composingLock = true;
    }
    
    public compositionUpdate(event: CompositionEvent & { target: HTMLElement }){
        //this.editor.ir.observer.flush()
        return
    }

    public compositionEnd(event: CompositionEvent & { target: HTMLElement }){
        if(!this.composingLock) return
        //解锁，打字结束
        this.composingLock = false;

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

        //根据输入位置发布不同的事件
        /*let type = this.editor.ir.focueProcessor.getSelectedBlockMdType()
        if(type === Constants.ATTR_MD_BLOCK_HEADING){
            this.editor.ir.applicationEventPublisher.publish(Constants.IR_EVENT_REFRESHTOC)
        }
        //普通的输入需要刷新节点
        if(!this.editor.ir.contextRefresher.refreshFocusInline()){
            this.editor.ir.contextRefresher.refreshFocusBlock()
        }
        this.editor.ir.observer.flush()*/
    }
}

export default IRCompositionProcessor;