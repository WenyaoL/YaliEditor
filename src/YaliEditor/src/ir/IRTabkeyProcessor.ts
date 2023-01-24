/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import {KeyProcessor} from './KeyProcessor'
import rangy from 'rangy';
import YaLiEditor from '../'
import Constants from '../constant/constants'
class IRTabkeyProcessor implements KeyProcessor{

    //编辑器
    public editor:YaLiEditor;

    constructor(editor:YaLiEditor){
        this.editor = editor
    }

    insert(){
        if(this.editor.ir.focueProcessor.getSelectedBlockMdType() === Constants.ATTR_MD_BLOCK_FENCE){
            return false
        }
        let sel = rangy.getSelection()
        let r = sel.getRangeAt(0)
        let start = r.startContainer
        let startOff = r.startOffset
        let endOff = r.endOffset
        if(start.nodeType == 3){
            start.textContent = start.textContent.slice(0,startOff)+"\u00A0\u00A0"+start.textContent.slice(endOff)
            sel.collapse(start,startOff+2)
        }
        return true
    }

    execute(event: KeyboardEvent) {
        if(this.insert()){
            this.editor.ir.observer.flush()
            event.preventDefault()
        }
    }

}


export default IRTabkeyProcessor