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
import {isBlockMdFence} from '../util/inspectElement'
import rangy from 'rangy';
class IRArrowMoveKeyProcessor implements KeyProcessor{

    public editor:YaliEditor;

    constructor(editor:YaliEditor){
        this.editor = editor
    }

    arrowUpKeydown(){
        let sel = rangy.getSelection()
        let fence = this.editor.ir.focueProcessor.getSelectedBlockMdElement()
        if(!isBlockMdFence(fence)) return
        
        let r = sel.getRangeAt(0)

        let viewInfo = this.editor.ir.renderer.codemirrorManager.getViewInfo(fence.id)
        let pos = viewInfo.view.posAtDOM(r.startContainer,r.startOffset)
        let blockInfo = viewInfo.view.lineBlockAt(pos)
        
        if(blockInfo.top == 0){
            //兄弟节点
            let sibling = fence.previousElementSibling
            if(!sibling) return false
            if(sibling.lastElementChild){
                r.collapseAfter(sibling.lastElementChild)
                sel.setSingleRange(r)
            }else{
                r.collapseAfter(sibling)
                sel.setSingleRange(r)
            }

            return true
        }

        return false
    }

    arrowDownKeydown(){
        let sel = rangy.getSelection()
        let fence = this.editor.ir.focueProcessor.getSelectedBlockMdElement()

        if(!isBlockMdFence(fence)) return
        let r = sel.getRangeAt(0)

        let viewInfo = this.editor.ir.renderer.codemirrorManager.getViewInfo(fence.id)
        let pos = viewInfo.view.posAtDOM(r.startContainer,r.startOffset)
        let length = viewInfo.view.state.doc.length
        let blockInfo = viewInfo.view.lineBlockAt(pos)
        if(blockInfo.from == length){
  
            //兄弟节点
            let sibling = fence.nextElementSibling
            if(!sibling) return false
            if(sibling.lastElementChild){
                r.collapseBefore(sibling.lastElementChild)
                sel.setSingleRange(r)
            }else{
                r.collapseBefore(sibling)
                sel.setSingleRange(r)
            }

            return true
        }
        
        return false
    }

    arrowLeftKeydown(){
        let sel = rangy.getSelection()
        

        let fence = this.editor.ir.focueProcessor.getSelectedBlockMdElement()

        if(!isBlockMdFence(fence)) return

        let r = sel.getRangeAt(0)

        let viewInfo = this.editor.ir.renderer.codemirrorManager.getViewInfo(fence.id)
        let pos = viewInfo.view.posAtDOM(r.startContainer,r.startOffset)
        if(pos == 0){
            //兄弟节点
            let sibling = fence.previousElementSibling
            if(!sibling) return false
            if(sibling.lastElementChild){
                r.collapseAfter(sibling.lastElementChild)
                sel.setSingleRange(r)
            }else{
                r.collapseAfter(sibling)
                sel.setSingleRange(r)
            }

            return true
        }

        return false
    }

    arrowRightKeydown(){
        let sel = rangy.getSelection()
        let fence = this.editor.ir.focueProcessor.getSelectedBlockMdElement()

        if(!isBlockMdFence(fence)) return
        let r = sel.getRangeAt(0)

        let viewInfo = this.editor.ir.renderer.codemirrorManager.getViewInfo(fence.id)
        let pos = viewInfo.view.posAtDOM(r.startContainer,r.startOffset)
        let blockInfo = viewInfo.view.lineBlockAt(pos)
        if(pos == blockInfo.to){
            //兄弟节点
            let sibling = fence.nextElementSibling
            if(!sibling) return false
            if(sibling.lastElementChild){
                r.collapseBefore(sibling.lastElementChild)
                sel.setSingleRange(r)
            }else{
                r.collapseBefore(sibling)
                sel.setSingleRange(r)
            }

            return true
        }

        return false
    }

    keydownExecute(event: KeyboardEvent){
        let flag = false

        switch (event.key) {
            case "ArrowUp":
                flag = this.arrowUpKeydown()
                break;
            case "ArrowDown":
                flag = this.arrowDownKeydown()
                break;
            case "ArrowRight":
                flag = this.arrowRightKeydown()
                break;    
            case "ArrowLeft":
                flag = this.arrowLeftKeydown()
                break;
            default:
                break;
        }
        return flag
    }


    execute(event: KeyboardEvent) {
        if(event.type === "keydown"){
            //更新焦点元素(确保获取的是最新的聚焦元素)
            this.editor.ir.focueProcessor.updateFocusElement()
            return this.keydownExecute(event)
        }
        
    }

    
    
}

export default IRArrowMoveKeyProcessor;