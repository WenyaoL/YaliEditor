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

  bindClick(element: HTMLElement) {
    element.addEventListener("click", (event: MouseEvent & { target: HTMLElement }) => {
        this.editor.ir.clickProcessor.execute(event)
    })
  }


  bindEvent(element: HTMLElement): void {
    //this.bindSelectstartEvent(element)
    this.bindClick(element)
  }

}

export default IRSelectBinder;