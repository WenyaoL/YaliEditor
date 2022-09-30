/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import {KeyProcessor} from './KeyProcessor'
import rangy from 'rangy';
import YaLiEditor from '../'
import Constants from '../constants'
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
        r.insertNode(document.createTextNode("\t"))
        return true
    }

    execute(event: KeyboardEvent) {
        if(this.insert()){
            event.preventDefault()
        }
    }

}


export default IRTabkeyProcessor