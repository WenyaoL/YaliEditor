import YaliEditor from '../index'
import IR from '.';
import Constants from "../constant/constants";

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

        //根据输入位置发布不同的事件
        let type = this.editor.ir.focueProcessor.getSelectedBlockMdType()
        if(type === Constants.ATTR_MD_BLOCK_HEADING){
            this.editor.ir.applicationEventPublisher.publish(Constants.IR_EVENT_REFRESHTOC)
        }
        //普通的输入需要刷新节点
        if(!this.editor.ir.contextRefresher.refreshFocusInline()){
            this.editor.ir.contextRefresher.refreshFocusBlock()
        }
        this.editor.ir.observer.flush()
    }
}

export default IRCompositionProcessor;