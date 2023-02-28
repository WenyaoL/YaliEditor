/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import YaliEditor from '../index'
import { KeyProcessor } from './KeyProcessor';
import {
    IRfindClosestFence,
    IRfindClosestTop
} from '../util/findElement'
import {isMdBlockFence, isMdInlineEmoji} from '../util/inspectElement'
import rangy from 'rangy';
class IRArrowMoveKeyProcessor implements KeyProcessor{

    public editor:YaliEditor;

    constructor(editor:YaliEditor){
        this.editor = editor
    }

    

    keydownExecute(event: KeyboardEvent){
        if((event.target as Element).tagName == "INPUT") return false
        
        const {block:mdBlock,inline:mdInline} = this.editor.ir.focueProcessor.getSelectedMdElement()

        if(isMdInlineEmoji(mdInline)){
            return this.editor.ir.state.emojiArrowMove(mdBlock,mdInline,event)
        }
        

        if(isMdBlockFence(mdBlock)){
            return this.editor.ir.state.fenceArrowMove(mdBlock,mdInline,event)
        }

        
        return false
    }


    execute(event: KeyboardEvent) {
        if(event.key!="ArrowUp" && event.key!="ArrowDown" && event.key!="ArrowLeft" && event.key == "ArrowRight") return false
        if(event.type === "keydown"){
            //更新焦点元素(确保获取的是最新的聚焦元素)
            this.editor.ir.focueProcessor.updateFocusElement()
            return this.keydownExecute(event)
        }
        
    }

    
    
}

export default IRArrowMoveKeyProcessor;