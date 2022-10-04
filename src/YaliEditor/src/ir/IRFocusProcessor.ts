/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { findClosestByAttribute,
    findClosestByClassName,
    findClosestByTop,
    IRfindClosestMdBlock,
    IRfindClosestMdInline,
    IRfindClosestLi,
    IRfindClosestTop
} from "../util/findElement";
import Constants from "../constants";
import rangy from "rangy";
import YaLiEditor from "..";

class IRFocusProcessor{
    //当前被选中的md-inline原生
  private selectedInlineMdElement:HTMLElement|null = null;
  private selectedBlockMdElement:HTMLElement|null = null;


  public editor:YaLiEditor
  //选择对象,代表选择对象在面板的最后位置
  public sel:RangySelection
  //当前位置的bookmark
  private bookmark:any;
  private lastBookmark:any;

  //修改锁(发生修改操作前应该锁上)
  private modifyLock:boolean;
  //修改操作之前的bookmark
  private modifyBeforeBookmark:any;


  constructor(editor:YaLiEditor){
    this.editor = editor
  }
  

  /**
   * 刷新所有状态信息
   */
  update(){
    this.updateFocusElement()
    this.updateBookmark()
  }

  /**
   * 给定起点位置，去刷新当前选中的元素
   * @param start 
   */
  updateFocusElementByStart(start?:Node){
    this.sel = rangy.getSelection()
    if(!start) start = this.sel.getRangeAt(0).startContainer

    if(this.selectedBlockMdElement) this.selectedBlockMdElement.classList.remove("md-focus")
    if(this.selectedInlineMdElement) this.selectedInlineMdElement.classList.remove("md-expand")

    this.selectedInlineMdElement = IRfindClosestMdInline(start)
    this.selectedBlockMdElement = IRfindClosestMdBlock(start)

    this.selectedInlineMdElement?.classList.add("md-expand")
    this.selectedBlockMdElement?.classList.add("md-focus")
  }

  /**
   * 根据当前光标位置刷新选中元素
   */
  updateFocusElement(){
    //跟新选择对象为最新select
    this.sel = rangy.getSelection()
    this.updateFocusElementByStart(this.sel.getRangeAt(0).startContainer)
  }


  updateBookmark(){
    this.sel = rangy.getSelection()
    this.lastBookmark = this.bookmark
    this.bookmark = this.sel.getBookmark(this.editor.ir.rootElement) 

  }

  /**
   * 释放修改锁
   */
  releaseModifyLock(){
    this.modifyLock = false
  }

  /**
   * 修改前更新，更新所有修改前的定位信息，并且会给对象上修改锁。
   * 只有在一系列修改之后，才会将修改锁释放，否则将无法进行更新
   */
  updateBeforeModify(){
    this.sel = rangy.getSelection()

    //上锁前跟新修改前的bookmark
    if(!this.modifyLock){
      this.modifyBeforeBookmark = this.sel.getBookmark(this.editor.ir.rootElement)
    }
    
    this.modifyLock = true
  }

  updateAfterModify(){
    this.modifyLock = false
  }



  getBookmark(){
    return this.bookmark
  }

  getLastBookmark(){
    return this.lastBookmark
  }

  getModifyBeforeBookmark(){
    return this.modifyBeforeBookmark
  }

  getSelectedBlockMdElement(){
    return this.selectedBlockMdElement
  }

  getSelectedInlineMdElement(){
    return this.selectedInlineMdElement
  }

  getSelectedBlockMdType(){
    if(this.selectedBlockMdElement){
      return this.selectedBlockMdElement.getAttribute(Constants.ATTR_MD_BLOCK)
    }
    return null
  }

  getSelectedInlineMdType(){
    if(this.selectedInlineMdElement){
      return this.selectedInlineMdElement.getAttribute(Constants.ATTR_MD_INLINE)
    }
    return null
  }
}


export default IRFocusProcessor;