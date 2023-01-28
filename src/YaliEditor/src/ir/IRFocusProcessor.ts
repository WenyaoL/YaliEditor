/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import {
  findClosestByAttribute,
  findClosestByClassName,
  findClosestByTop,
  IRfindClosestMdBlock,
  IRfindClosestMdInline,
  IRfindClosestLi,
  IRfindClosestTop
} from "../util/findElement";
import Constants from "../constant/constants";
import rangy from "rangy";
import YaLiEditor from "..";
import { isMdInline } from "../util/inspectElement";

class IRFocusProcessor {
  //当前被选中的md-inline原生
  private selectedInlineMdElement: HTMLElement | null = null;
  private selectedBlockMdElement: HTMLElement | null = null;


  public editor: YaLiEditor
  //选择对象,代表选择对象在面板的最后位置
  public sel: RangySelection
  //当前位置的bookmark
  private bookmark: any;
  private lastBookmark: any;

  //修改锁(发生修改操作前应该锁上)
  private modifyLock: boolean;
  //修改操作之前的bookmark(定位基于整个面板)
  private modifyBeforeBookmark: any;
  //修改操作之前的二级bookmark(定位基于整个段落块)
  private modifyBeforeSecondBookmark: any

  constructor(editor: YaLiEditor) {
    this.editor = editor
  }


  /**
   * 刷新所有状态信息
   */
  update() {
    this.updateFocusElement()
    this.updateBookmark()
  }

  /**
   * 锁定给定元素为聚焦元素
   * @param block 
   */
  setFocusElementByMdblock(block?: HTMLElement){
    this.sel = rangy.getSelection()
    if (!block) block = IRfindClosestMdBlock(this.sel.getRangeAt(0).startContainer)
    if (this.selectedBlockMdElement) this.selectedBlockMdElement.classList.remove("md-focus")
    this.selectedBlockMdElement = block
    this.selectedBlockMdElement?.classList.add("md-focus")
  }

  setFocusElementByMdinline(inline?:HTMLElement){
    this.sel = rangy.getSelection()
    if (!inline) inline = IRfindClosestMdInline(this.sel.getRangeAt(0).startContainer)
    if (this.selectedInlineMdElement) this.selectedInlineMdElement.classList.remove("md-expand")
    this.selectedInlineMdElement = inline
    this.selectedInlineMdElement?.classList.add("md-expand")
  }


  /**
   * 给定md-inline并将光标聚焦到上面
   * @param inline 
   */
  focusMdInline(inline:HTMLElement){
    this.sel = rangy.getSelection()
    if(isMdInline(inline)){
      this.setFocusElementByMdinline(inline)
      this.sel.collapse(inline.lastChild,inline.lastChild.textContent.length)
    }
  }

  /**
   * 给定IR面板，刷新改面板下的焦点位置
   * @param root 
   */
  updateFocusElementByRoot(root?: HTMLElement) {
    this.sel = rangy.getSelection()
    if (!root) root = this.editor.ir.rootElement
    const focusElements = root.getElementsByClassName("md-focus")
    const expandElements = root.getElementsByClassName("md-expand")
    const start = this.sel.getRangeAt(0).startContainer

    for (let index = 0; index < focusElements.length; index++) {
      const element = focusElements[index];
      element.classList.remove("md-focus")
    }

    for (let index = 0; index < expandElements.length; index++) {
      const element = expandElements[index];
      element.classList.remove("md-expand")
    }

    this.selectedInlineMdElement = IRfindClosestMdInline(start)
    this.selectedBlockMdElement = IRfindClosestMdBlock(start)

    this.selectedInlineMdElement?.classList.add("md-expand")
    this.selectedBlockMdElement?.classList.add("md-focus")
  }

  /**
   * 给定起点位置，去刷新当前选中的元素
   * @param start 
   */
  updateFocusElementByStart(start?: Node) {
    this.sel = rangy.getSelection()
    if (!start) start = this.sel.getRangeAt(0).startContainer
    this.updateFocusMdInlineByStart(start)
    this.updateFocusMdBlockByStart(start)
  }

  /**
   * 给定起点，去刷新当前选中的md-block
   * @param start 
   * @returns 
   */
  updateFocusMdBlockByStart(start?: Node) {
    if (!start) start = this.sel.getRangeAt(0).startContainer
    const block = IRfindClosestMdBlock(start)
    //当前聚焦的md-block元素没变化，不处理
    if (block == this.selectedBlockMdElement) return
    //移除当前聚焦元素
    if (this.selectedBlockMdElement) this.selectedBlockMdElement.classList.remove("md-focus")
    //移除面板上可能残留的聚焦元素
    const focus = this.editor.rootElement.getElementsByClassName("md-focus")
    if (focus.length > 0) {
      Array.from(focus).forEach((e) => {
        e.classList.remove("md-focus")
      })
    }
    //更新
    this.selectedBlockMdElement = block
    this.selectedBlockMdElement?.classList.add("md-focus")
  }

  /**
   * 给定起点，去刷新当前选中的md-inline
   * @param start 
   * @returns 
   */
  updateFocusMdInlineByStart(start?: Node) {
    if (!start) start = this.sel.getRangeAt(0).startContainer
    const inline = IRfindClosestMdInline(start)
    //当前聚焦的md-inline元素没变化，不处理
    if (inline == this.selectedInlineMdElement) return

    //移除当前聚焦元素
    if (this.selectedInlineMdElement) this.selectedInlineMdElement.classList.remove("md-expand")
    //移除面板上可能残留的聚焦元素
    const expand = this.editor.rootElement.getElementsByClassName("md-expand")
    if (expand.length > 0) {
      Array.from(expand).forEach((e) => {
        e.classList.remove("md-expand")
      })
    }
    //更新
    this.selectedInlineMdElement = inline
    this.selectedInlineMdElement?.classList.add("md-expand")
  }

  /**
   * 根据当前光标位置刷新选中元素
   */
  updateFocusElement() {
    //跟新选择对象为最新select
    this.sel = rangy.getSelection()
    this.updateFocusElementByStart(this.sel.getRangeAt(0).startContainer)
  }

  updateBookmark() {
    this.sel = rangy.getSelection()
    this.lastBookmark = this.bookmark
    this.bookmark = this.sel.getBookmark(this.editor.ir.rootElement)

  }

  /**
   * 释放修改锁
   */
  releaseModifyLock() {
    this.modifyLock = false
  }

  /**
   * 修改前更新，更新所有修改前的定位信息，并且会给对象上修改锁。
   * 只有在一系列修改之后，才会将修改锁释放，否则将无法进行更新
   */
  updateBeforeModify() {
    this.sel = rangy.getSelection()
    //上锁前跟新修改前的bookmark
    if (!this.modifyLock) {
      try {
        this.updateFocusElement()
        this.modifyBeforeBookmark = this.sel.getBookmark(this.editor.ir.rootElement)
        this.modifyBeforeSecondBookmark = this.sel.getBookmark(this.selectedBlockMdElement)
      } catch {
        this.modifyBeforeBookmark = this.sel.getBookmark(this.editor.ir.rootElement)
        this.modifyBeforeSecondBookmark = null
      }
    }
    this.modifyLock = true
  }

  updateAfterModify() {
    this.modifyLock = false
  }



  getBookmark() {
    return this.bookmark
  }

  getLastBookmark() {
    return this.lastBookmark
  }

  getModifyBeforeBookmark() {
    return this.modifyBeforeBookmark
  }

  getModifyBeforeSecondBookmark() {
    return this.modifyBeforeSecondBookmark
  }

  getSelectedBlockMdElement(refresh: boolean = true) {
    if (refresh) this.updateFocusElement()
    return this.selectedBlockMdElement
  }

  getSelectedInlineMdElement(refresh: boolean = true) {
    if (refresh) this.updateFocusElement()
    return this.selectedInlineMdElement
  }

  getSelectedMdElement(refresh: boolean = true) {
    if (refresh) this.updateFocusElement()
    return { block: this.selectedBlockMdElement, inline: this.selectedInlineMdElement }
  }

  getSelectedBlockMdType(refresh: boolean = true) {
    if (refresh) this.updateFocusElement()
    if (this.selectedBlockMdElement) {
      return this.selectedBlockMdElement.getAttribute(Constants.ATTR_MD_BLOCK)
    }
    return null
  }

  getSelectedInlineMdType(refresh: boolean = true) {
    if (refresh) this.updateFocusElement()
    if (this.selectedInlineMdElement) {
      return this.selectedInlineMdElement.getAttribute(Constants.ATTR_MD_INLINE)
    }
    return null
  }

  getSelectedInlineBeLikeType() {
    if (this.selectedInlineMdElement) {
      return this.selectedInlineMdElement.getAttribute(Constants.ATTR_MD_LIKE)
    }
    return null
  }
}


export default IRFocusProcessor;