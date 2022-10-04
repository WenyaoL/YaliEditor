/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import YaLiEditor from "..";
import { BaseEventBinder } from "../../types";
import { findClosestByAttribute,IRfindClosestMdBlock} from "../util/findElement";
import rangy from "rangy";

declare global {  //设置全局属性
  interface Window {  //window对象属性
    electronAPI: any;   //加入对象
  }
}

class IRSelectBinder implements BaseEventBinder{



    public editor:YaLiEditor;

    constructor(editor:YaLiEditor){
      this.editor = editor;
    }


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

        this.editor.ir.focueProcessor.update()
        //console.log(this.editor.ir.focueProcessor.getBookmark());
        
        let sel = this.editor.ir.focueProcessor.sel
        let r = sel.getRangeAt(0)
        
        

        if(event.ctrlKey){
          this.ctrlKeyClick(event)
        }

        if(event.target.tagName == "IMG"){
          r.collapseAfter(event.target.previousElementSibling?.lastElementChild)
          sel.setSingleRange(r)
        }
        
        
        const topClassName = this.editor.ir.getRootElementClassName()
        //console.log(sel.getBookmark(IRfindClosestMdBlock(r.startContainer)));
        
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