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
            if(event.inputType==="deleteContentBackward"){
                console.log("触发删除");
                return;
            }
            console.log("触发源数据修改");
            //来自md-meta输入是需要跟新对应标签的src
            const r = rangy.getSelection().getRangeAt(0)
            let start =  r.startContainer as HTMLElement
            if(start.nodeType === 3){
                start = start.parentElement
            }
            
            let e = findClosestByAttribute(start,CONSTANTS.ATTR_MD_INLINE,"img",this.editor.ir.getRootElementClassName())
            if(e){
                
                
                const src = e.getElementsByClassName("md-img-url md-hiden md-meta").item(0).textContent
                e.getElementsByTagName("img").item(0).src =src
                //event.preventDefault()
            }
            e = findClosestByAttribute(start,CONSTANTS.ATTR_MD_INLINE,"link",this.editor.ir.getRootElementClassName())
            if(e){
                e.getElementsByTagName("a")[0].href = start.innerText
                
                //event.preventDefault()
            }
            

            //一般打字不处理
            if(event.isComposing){
                return;
            }

            //查看输入是否能符合语法，生成html块

            //添加undo
            console.log("输入处理");
        })
    }


    bindEvent(element: HTMLElement): void {
        this.bindInputEvent(element);
    }

}

export default IRInputBinder;