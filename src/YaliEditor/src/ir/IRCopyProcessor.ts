/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import rangy from "rangy";
import YaliEditor from '../index'

class IRCopyProcessor{

    public editor:YaliEditor;

    constructor(editor:YaliEditor){
        this.editor = editor;
    }

    copyText(){
        let sel = rangy.getSelection()
        return sel.toString()
    }

    copyHtml(){
        let sel = rangy.getSelection()
        return sel.toHtml()
    }

    copyMarkdown(){
        let html = this.copyHtml()
        return this.editor.ir.parser.turndown(html)
    }

    execute(event: ClipboardEvent) {
        //event.clipboardData?.setData('text/plain',this.copyMarkdown())
        event.clipboardData?.setData('text/markdown',this.copyMarkdown())
        
        event.preventDefault()
    }  
}

export default IRCopyProcessor