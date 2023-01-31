import YaLiEditor from "..";
import {
    IRfindClosestMdBlock,
    IRfindClosestMdInline,
} from "../util/findElement";

export class IRClickProcessor {

    //编辑器
    public editor: YaLiEditor;

    constructor(editor: YaLiEditor) {
        this.editor = editor
    }

    ctrlKeyClick(event: MouseEvent & { target: HTMLElement }) {
        let e = IRfindClosestMdInline(event.target)
        if (!e) return
        const inlineType = e.getAttribute("md-inline")
        if (inlineType == 'link') {
            const a = e.getElementsByTagName("a").item(0)
            //通过浏览器打开页面
            window.electronAPI.openURL({ url: a.href })
        }
    }

    click(event: MouseEvent & { target: HTMLElement }) {


        //点击进行光标偏移(主要对一些隐藏类的操作)
        if (this.editor.markdownTool.deviationCursor(event.target)) {
            event.preventDefault()
            return
        }

        let e = IRfindClosestMdInline(event.target)
        if (!e) {
            e = IRfindClosestMdBlock(event.target)
        }
        if (!e) {
            const lastE = event.target.lastElementChild
            if (!lastE) return
            if (lastE.tagName === "P" && (lastE.textContent.length == 0 || lastE.textContent == "\n")) {
                return
            } else {
                event.target.insertAdjacentHTML("beforeend", '<p md-block="paragraph"><br></p>')
                return
            }
        }

        
        return
    }

    execute(event: MouseEvent  & { target: HTMLElement }) {
        this.editor.ir.focueProcessor.update()
        let sel = this.editor.ir.focueProcessor.sel
        let r = sel.getRangeAt(0)
        if (event.ctrlKey) {
            this.ctrlKeyClick(event)
        }
        this.click(event)
        //this.editor.ir.focueProcessor.updateFocusElementByStart(r.startContainer)
        const {block,inline} = this.editor.ir.focueProcessor.getSelectedMdElement()
        this.editor.ir.applicationEventPublisher.publish("clickChanged",{block,inline})
    }
}

export default IRClickProcessor;