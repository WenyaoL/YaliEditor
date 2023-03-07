import YaLiEditor from "..";
import { createParagraph } from "../util/createElement";
import {
    IRfindClosestMdBlock,
    IRfindClosestMdInline,
} from "../util/findElement";
import { isMdBlockParagraph, isMdBlockToc, isYaliIR } from "../util/inspectElement";

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

        const block = this.editor.ir.focueProcessor.getSelectedBlockMdElement(false)
        
        //A标签跳转
        if(event.target.tagName == "A" && !event.target.classList.contains("md-link-a") && !isMdBlockToc(block)){

            window.electronAPI.openURL({ url: (event.target as HTMLAnchorElement).href })
            event.preventDefault()
            return
        }

        //点击进行光标偏移(主要对一些隐藏类的操作)
        if (this.editor.markdownTool.deviationCursor(event.target)) {
            event.preventDefault()
            return
        }
        
        //最后留空行
        if(isYaliIR(event.target) && !isMdBlockParagraph(event.target.lastElementChild)){
            event.target.appendChild(createParagraph())
        }

        return
    }

    execute(event: MouseEvent  & { target: HTMLElement }) {
        this.editor.ir.focueProcessor.update()

        if (event.ctrlKey) {
            this.ctrlKeyClick(event)
        }
        this.click(event)

        const fence = this.editor.ir.rootElement.querySelector(`div[md-like="fence"]`)
        this.editor.ir.state.fenceEnter(fence)

        event.preventDefault()
        //this.editor.ir.focueProcessor.updateFocusElementByStart(r.startContainer)
        const {block,inline} = this.editor.ir.focueProcessor.getSelectedMdElement(false)
        this.editor.ir.applicationEventPublisher.publish("clickChanged",{block,inline})
    }
}

export default IRClickProcessor;