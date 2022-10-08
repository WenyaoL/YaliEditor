import YaLiEditor from '..'
import rangy from "rangy";
import {findClosestByAttribute} from '../util/findElement'
import {strToElement} from '../util/inspectElement'
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

            //如果输入的时的位置是标题
            let type = this.editor.ir.focueProcessor.getSelectedBlockMdType()
            if(type === Constants.ATTR_MD_BLOCK_HEADING){
                this.editor.ir.applicationEventPublisher.publish(Constants.IR_EVENT_REFRESHTOC)
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