/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import YaLiEditor from "..";
import { BaseEventBinder } from "../../types";
import { findClosestByAttribute } from "../util/findElement";
import rangy from "rangy";

declare global {  //设置全局属性
  interface Window {  //window对象属性
    electronAPI: any;   //加入对象
  }
}

class IRSelectBinder implements BaseEventBinder{

  //当前被选中的md-inline原生
  private selectedInlineMdElement = null;
  private selectedBlockMdElement = null;

    public editor:YaLiEditor;

    constructor(editor:YaLiEditor){
      this.editor = editor;
    }

    /**
     * 跟新md class属性
     * @param e 
     * @returns 
     */
    /*updateMdElement(e: HTMLElement,isBlock:boolean = false){
        if(isBlock){
          if(this.selectedBlockMdElement !== null){
            this.selectedBlockMdElement.classList.remove("md-expand")
          }
          this.selectedBlockMdElement = e;
          this.selectedBlockMdElement.classList.add("md-expand")
          return ;

        }

        if(this.selectedInlineMdElement !== null){
            this.selectedInlineMdElement.classList.remove("md-expand")
        }
        this.selectedInlineMdElement = e;
        this.selectedInlineMdElement.classList.add("md-expand")
        return ;
    }*/

    ctrlKeyClick(event: MouseEvent & { target: HTMLElement }){
      const topClassName = this.editor.ir.getRootElementClassName()
      let e = findClosestByAttribute(event.target,"md-inline","",topClassName)
      if(!e) return 
      const inlineType = e.getAttribute("md-inline")
      if(inlineType == 'link'){
        const a = e.getElementsByTagName("a").item(0)
        //通过浏览器打开页面
        window.electronAPI.openURL({url:a.href})
      }
    }
    
    bindClick(element: HTMLElement){
      element.addEventListener("click", (event: MouseEvent & { target: HTMLElement }) => {
        this.editor.ir.focueProcessor.updateBookmark()
        let sel = this.editor.ir.focueProcessor.sel
        let r = sel.getRangeAt(0)
        this.editor.ir.undoManager.updateBookmark()
        if(event.ctrlKey){
          this.ctrlKeyClick(event)
        }

        if(event.target.tagName == "IMG"){
          r.collapseAfter(event.target.previousElementSibling?.lastElementChild)
          sel.setSingleRange(r)
        }
        
        
        const topClassName = this.editor.ir.getRootElementClassName()

        let isInline = true;
        let e = findClosestByAttribute(event.target,"md-inline","",topClassName)
        if(!e){
          e = findClosestByAttribute(event.target,"md-block","",topClassName)
          isInline = false;
        }
        if(!e){
          const lastE = event.target.lastElementChild
          if(!lastE) return 
          if(lastE.tagName === "P" && (lastE.textContent.length==0 || lastE.textContent == "\n")){
            return
          }else{
            event.target.insertAdjacentHTML("beforeend",'<p md-block="paragraph"><br></p>')
            return
          }
        }

        this.editor.ir.focueProcessor.updateFocusElementByStart(event.target)

        return true;
      })
    }


    bindEvent(element: HTMLElement): void {


        //this.bindSelectstartEvent(element)
        this.bindClick(element)
    }

}

export default IRSelectBinder;