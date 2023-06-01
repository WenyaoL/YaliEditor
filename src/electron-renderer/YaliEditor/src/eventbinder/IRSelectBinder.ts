/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import YaLiEditor from "..";
import { BaseEventBinder } from "../../types";


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
    element.addEventListener("click", (event: MouseEvent ) => {
        this.editor.ir.clickProcessor.execute(event as MouseEvent  & { target: HTMLElement })
    })
  }


  bindEvent(element: HTMLElement): void {
    //this.bindSelectstartEvent(element)
    this.bindClick(element)
  }

}

export default IRSelectBinder;