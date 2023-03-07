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
        html = this.editor.markdownTool.htmlPatch(html)
        return this.editor.ir.parser.turndown(html)
    }

    execute(event: ClipboardEvent) {
        
        event.clipboardData?.setData('text/markdown',this.copyMarkdown())
        //根据是否通过
        if(event.isTrusted){
            event.clipboardData?.setData('text/plain',this.copyMarkdown())
        }else{
            let ev = event as any
            let type = ev.info
            let text = ''
            if(type == "text") text = this.copyText()
            else text = this.copyMarkdown()
            navigator.clipboard.writeText(text)
        }
        
        event.preventDefault()
    }  
}

export default IRCopyProcessor