import YaLiEditor from '..'
import Constants from "../constant/constants";
import Reg from '../constant/reg';
import { isMdBlockCode, isMdBlockFence, isMdBlockMath, isMdBlockMeta } from '../util/inspectElement';

class IRInputProcessor{
    
    //编辑器
    public editor:YaLiEditor;

    constructor(editor:YaLiEditor){
        this.editor = editor
    }
    
    /**
     * 刷新渲染
     */
     execute(event: InputEvent){
        this.editor.ir.focueProcessor.updateBookmark()

        //一般打字不处理
        if(event.isComposing){
            return;
        }
        const block = this.editor.ir.focueProcessor.getSelectedBlockMdElement(false)
        if (!block || isMdBlockFence(block) || isMdBlockMath(block) ||isMdBlockMeta(block)||isMdBlockCode(block)) return
        
        //根据输入位置发布不同的事件
        const blockType = this.editor.ir.focueProcessor.getSelectedBlockMdType()

        if(blockType === Constants.ATTR_MD_BLOCK_HEADING){
            this.editor.ir.applicationEventPublisher.publish(Constants.IR_EVENT_REFRESHTOC)
        }else if(blockType === Constants.ATTR_MD_BLOCK_FENCE || blockType === Constants.ATTR_MD_BLOCK_MATH){
            this.editor.ir.applicationEventPublisher.publish(Constants.IR_EVENT_CODEBLOCKINPUT)
            this.editor.ir.observer.flush()
            return
        }

        if(event.data == " "){
            this.editor.ir.contextRefresher.refreshFocusInline(true)
            this.editor.ir.observer.flush()
            return
        }
        
        if(!this.editor.ir.contextRefresher.refreshFocusInline()){
            this.editor.ir.contextRefresher.refreshFocusBlock()
        }

        this.editor.ir.observer.flush()
    }

}   

export default IRInputProcessor