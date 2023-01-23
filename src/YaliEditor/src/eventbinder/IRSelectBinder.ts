/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import YaLiEditor from "..";
import { BaseEventBinder } from "../../types";
import { findClosestByAttribute, IRfindClosestMdBlock } from "../util/findElement";
import rangy from "rangy";

declare global {  //设置全局属性
  interface Window {  //window对象属性
    electronAPI: any;   //加入对象
  }
}

class IRSelectBinder implements BaseEventBinder {



  public editor: YaLiEditor;

  constructor(editor: YaLiEditor) {
    this.editor = editor;
  }


  ctrlKeyClick(event: MouseEvent & { target: HTMLElement }) {
    const topClassName = this.editor.ir.getRootElementClassName()
    let e = findClosestByAttribute(event.target, "md-inline", "", topClassName)
    if (!e) return
    const inlineType = e.getAttribute("md-inline")
    if (inlineType == 'link') {
      const a = e.getElementsByTagName("a").item(0)
      //通过浏览器打开页面
      window.electronAPI.openURL({ url: a.href })
    }
  }

  bindClick(element: HTMLElement) {
    element.addEventListener("click", (event: MouseEvent & { target: HTMLElement }) => {

      this.editor.ir.focueProcessor.update()
      //console.log(this.editor.ir.focueProcessor.getSelectedMdElement());
      
      let sel = this.editor.ir.focueProcessor.sel
      let r = sel.getRangeAt(0)

      if (event.ctrlKey) {
        this.ctrlKeyClick(event)
      }

      //点击进行光标偏移(主要对一些隐藏类的操作)
      if(this.editor.markdownTool.deviationCursor(event.target)){
        event.preventDefault()
        return
      }


      const topClassName = this.editor.ir.getRootElementClassName()


      let e = findClosestByAttribute(event.target, "md-inline", "", topClassName)
      if (!e) {
        e = findClosestByAttribute(event.target, "md-block", "", topClassName)
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

      this.editor.ir.focueProcessor.updateFocusElementByStart(r.startContainer)   
      return

    })
  }


  bindEvent(element: HTMLElement): void {


    //this.bindSelectstartEvent(element)
    this.bindClick(element)


  }

}

export default IRSelectBinder;