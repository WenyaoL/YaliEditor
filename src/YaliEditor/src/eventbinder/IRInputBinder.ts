/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import {findClosestByAttribute} from '../util/findElement'
import rangy from 'rangy'
import { BaseEventBinder } from '../../types';
import CONSTANTS from "../constants";
import YaLiEditor from '..';
class IRInputBinder implements BaseEventBinder{

    public editor:YaLiEditor;

    constructor(editor:YaLiEditor){
        this.editor = editor;
    }

    bindInputEvent(element: HTMLElement){
        element.addEventListener("input",(event: InputEvent) => {
            this.editor.ir.inputProcessor.execute(event)
        })
    }

    bindBeforeInputEvent(element: HTMLElement){
        element.addEventListener('beforeinput',(event: InputEvent) => {
            
            if(event.isComposing) return
            //输入前更新修改前的位置，并对对象上修改锁
            this.editor.ir.focueProcessor.updateBeforeModify()
        })
    }

    bindEvent(element: HTMLElement): void {
        this.bindInputEvent(element);
        this.bindBeforeInputEvent(element);
    }

}

export default IRInputBinder;