import YaLiEditor from '..'
import Constants from "../constants";

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

            //根据输入位置发布不同的事件
            let type = this.editor.ir.focueProcessor.getSelectedBlockMdType()

            if(type === Constants.ATTR_MD_BLOCK_HEADING){
                this.editor.ir.applicationEventPublisher.publish(Constants.IR_EVENT_REFRESHTOC)
            }else if(type === Constants.ATTR_MD_BLOCK_FENCE || type === Constants.ATTR_MD_BLOCK_MATH){
                this.editor.ir.applicationEventPublisher.publish(Constants.IR_EVENT_CODEBLOCKINPUT)
            }
            
            if(event.inputType==="deleteContentBackward"){
                return;
            }

            //普通的输入需要刷新节点
            if(this.editor.ir.focueProcessor.getSelectedBlockMdType() == Constants.ATTR_MD_BLOCK_PARAGRAPH){
                if(!this.editor.ir.contextRefresher.refreshFocusInline()){
                    this.editor.ir.contextRefresher.refreshFocusBlock()
                }
                
            }
            
    }

}   

export default IRInputProcessor