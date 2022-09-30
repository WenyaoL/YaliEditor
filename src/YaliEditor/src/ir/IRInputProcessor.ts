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
            if(this.metaInput()){
                return 
            }
            
            //一般打字不处理
            if(event.isComposing){
                return;
            }

            //普通的输入需要刷新节点
            if(this.editor.ir.focueProcessor.getSelectedBlockMdType() == CONSTANTS.ATTR_MD_BLOCK_PARAGRAPH){
                this.freshNodeRender()
            }
            
    }

    metaInput(){
        const r = rangy.getSelection().getRangeAt(0)
        let start =  r.startContainer as HTMLElement
        if(start.nodeType === 3){
            start = start.parentElement
        }

        let e = findClosestByAttribute(start,CONSTANTS.ATTR_MD_INLINE,"img",this.editor.ir.getRootElementClassName())
        if(e){
            const src = e.getElementsByClassName("md-img-url md-hiden md-meta").item(0).textContent
            e.getElementsByTagName("img").item(0).src =src
            return true
        }


        e = findClosestByAttribute(start,CONSTANTS.ATTR_MD_INLINE,"link",this.editor.ir.getRootElementClassName())
        if(e){
            e.getElementsByTagName("a")[0].href = start.innerText
            return true
        }

        return false
    }



    freshNodeRender(){
        let sel = rangy.getSelection()
        let r = sel.getRangeAt(0)
        //获取当前所在的块
        let block = this.editor.ir.focueProcessor.getSelectedBlockMdElement()
        if(!block) return
        let turndown = this.editor.ir.parser.turndown(block.outerHTML)
        
        
        if(turndown.charAt(0) == "\\"){
            turndown = turndown.slice(1)
        }

        const res = this.editor.ir.renderer.render(turndown)

        
        if(!block.parentElement){
            this.editor.ir.focueProcessor.updateFocusElement()
            block = this.editor.ir.focueProcessor.getSelectedBlockMdElement()
        }
        
        if(!res) return
        //转化为dom
        let e = strToElement(res)
        if(e.tagName!="P" && e.textContent.length!= 0){
            //已经转化为新的块
            block.replaceWith(e)
            sel.collapse(e,1)
        }else{
            //不做任何处理
            return
        }
        
    }
}   

export default IRInputProcessor