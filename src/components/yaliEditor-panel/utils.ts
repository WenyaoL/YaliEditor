import ContextMenu from '@imengyu/vue3-context-menu'
import YaLiEditor from '../../YaliEditor/src'
import Constants from '../../YaliEditor/src/constants'
import rangy from 'rangy'
import {createTableItems,createHeadItems,createImgItems,createParagraphItems} from './tipitemsCommon'

export const exec = (editor:YaLiEditor,e: MouseEvent)=>{

    let focueProcessor = editor.ir.focueProcessor
    let element = e.target as HTMLElement
    focueProcessor.updateFocusElement()
    if(element.tagName=="IMG"){
        focueProcessor.updateFocusElementByStart(element)
    }
    
    let items:any[] = []

    const sel = focueProcessor.sel
    const blockType = focueProcessor.getSelectedBlockMdType()
    const inlineType = focueProcessor.getSelectedInlineMdType()

    let disableCopy = false
    //没选中东西的
    console.log(blockType);
    console.log(inlineType);
    
    if(sel.isCollapsed){
        disableCopy = true
    }


    //所在图片
    if(inlineType == Constants.ATTR_MD_INLINE_IMG){
        //选中现象的图片
        const r = sel.getRangeAt(0)
        if(element.tagName == "IMG" && element.previousElementSibling){
            r.selectNodeContents(element.previousElementSibling)
            sel.setSingleRange(r)
        }
        items=items.concat(createImgItems(disableCopy,editor))
    }

    //所在标题
    if(blockType == Constants.ATTR_MD_BLOCK_HEADING){
        items=items.concat(createHeadItems(disableCopy,editor))
    }

    //所在table
    if(blockType == Constants.ATTR_MD_BLOCK_TABLE){
        items=items.concat(createTableItems(disableCopy,editor))
    }
    
    
    //所在段落
    if(blockType == Constants.ATTR_MD_BLOCK_PARAGRAPH){
        items = items.concat(createParagraphItems(disableCopy,editor))
    }


      ContextMenu.showContextMenu({
        x: e.x,
        y: e.y,
        items: items,

      })
}