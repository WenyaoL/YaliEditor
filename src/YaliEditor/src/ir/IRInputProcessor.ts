import YaLiEditor from '..'
import rangy from "rangy";
import {findClosestByAttribute} from '../util/findElement'
import {strToElement} from '../util/inspectElement'
import CONSTANTS from "../constants";

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

            if(event.inputType==="deleteContentBackward"){
                return;
            }

            //来自md-meta输入是需要跟新对应标签的src
            /*if(this.metaInput()){
                return 
            }*/
            
            //一般打字不处理
            if(event.isComposing){
                return;
            }

            //普通的输入需要刷新节点
            if(this.editor.ir.focueProcessor.getSelectedBlockMdType() == CONSTANTS.ATTR_MD_BLOCK_PARAGRAPH){
                this.editor.ir.contextRefresher.refreshFocusBlock()
                this.editor.ir.contextRefresher.refreshFocusInline()
            }
            
    }

}   

export default IRInputProcessor