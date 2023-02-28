import YaLiEditor from "../..";
import { createPopper, Instance } from '@popperjs/core';
import EditorTool from "../EditorTool";
import BasePopper from "./BasePopper";

interface Suggestion{
    value:string,
    html?:string,
    eventListener:{
        [x in keyof HTMLElementEventMap]?:EventListenerOrEventListenerObject
    }
}


class SuggestionPopper extends BasePopper {
    editorTool: EditorTool
    activateIndex: number;
    activateElement: HTMLElement;
    itemCount: number;

    constructor(editorTool: EditorTool) {
        super()
        this.editorTool = editorTool

        //create element
        this.floatElement = document.createElement("div")
        this.editorTool.rootElement.appendChild(this.floatElement)
        this.floatElement.classList.add("yali-suggestionFloat")
    }


    public createSuggestionPopper(reference) {
        //销毁
        if (this.floatInstance) {
            this.destroy()
        }
        this.createPopper(reference, {
            placement: 'right',
        })
    }

    public clearData(){
        this.floatElement.innerHTML = ""
        this.activateIndex = -1
        this.activateElement = null
        this.itemCount = 0;
    }

    public showSuggestionPopper(suggestions: Suggestion[], isHtmlStr: boolean) {
        if(!suggestions || suggestions.length==0) return
        this.clearData()
        const popper = this.floatElement
        const ul = document.createElement("ul")
        popper.appendChild(ul)
        suggestions.forEach((suggestion, index) => {
            const li = document.createElement("li")
            li.classList.add("suggestion-item")
            li.setAttribute("key", index + "")
            if(suggestion.eventListener){
                Object.entries(suggestion.eventListener).forEach(([eventName,f])=>{
                    li.addEventListener(eventName,f)
                })
            }
            /*if (index == this.activateIndex) {
                li.classList.add("activate-item")
                this.activateElement = li
            }*/
            if (isHtmlStr) li.innerHTML = suggestion.html
            else li.innerText = suggestion.value
            ul.appendChild(li)
        })

        this.itemCount = ul.childElementCount

        // 启用事件侦听器
        this.floatInstance.setOptions((options) => ({
            ...options,
            modifiers: [
                ...options.modifiers,
                { name: 'eventListeners', enabled: true },
            ],
        }));

        // 更新位置
        this.floatInstance.update();

        popper.setAttribute("show", "")
    }



    public hidenSuggestionPopper() {
        const popper = this.floatInstance.state.elements.popper
        // 禁用事件侦听器
        this.floatInstance.setOptions((options) => ({
            ...options,
            modifiers: [
                ...options.modifiers,
                { name: 'eventListeners', enabled: false },
            ],
        }));
        //隐藏
        popper.removeAttribute("show")
    }

    public moveActiveItem(index: number) {
        if (index >= this.itemCount || index < 0) this.activateIndex = 0
        else this.activateIndex = index

        this.activateElement?.classList.remove("activate-item")
        this.activateElement = this.floatElement.querySelector(`li[key="${this.activateIndex}"]`)
        this.activateElement?.classList.add("activate-item")

        const top = this.floatElement.scrollTop
        const clientTop = this.floatElement.clientHeight

        const activateElementBoundingClientRect = this.activateElement.getBoundingClientRect()
        const floatElementBoundingClientRect = this.floatElement.getBoundingClientRect()

        if (floatElementBoundingClientRect.bottom <= activateElementBoundingClientRect.bottom) { //下方
            this.floatElement.scrollTop = top + activateElementBoundingClientRect.bottom - floatElementBoundingClientRect.bottom
        } else if (floatElementBoundingClientRect .top>= activateElementBoundingClientRect.top) { //上方
            this.floatElement.scrollTop = top + activateElementBoundingClientRect.top - floatElementBoundingClientRect .top
        }

    }


}

export default SuggestionPopper