import {findClosestByAttribute} from '../util/findElement'
import rangy from 'rangy'
import { BaseEventBinder } from '../../types';
import CONSTANTS from "../constants";
import YaLiEditor from '..';
class IRInputCanUndoBinder implements BaseEventBinder{

    public editor:YaLiEditor;

    constructor(editor:YaLiEditor){
        this.editor = editor;
    }

    bindInputEvent(element: HTMLElement){
        element.addEventListener("input",(event: InputEvent) => {
            
        })
    }


    bindEvent(element: HTMLElement): void {
        this.bindInputEvent(element);
    }

}

export default IRInputCanUndoBinder;