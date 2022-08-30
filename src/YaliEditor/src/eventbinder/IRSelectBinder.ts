import YaLiEditor from "..";
import { BaseEventBinder } from "../../types";
import { findClosestByAttribute } from "../util/findElement";
import rangy from "rangy";
import log from "../util/loging";

class IRSelectBinder implements BaseEventBinder{

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
    updateMdElement(e: HTMLElement){
        if(this.selectedInlineMdElement !== null){
            this.selectedInlineMdElement.classList.remove("md-expand")
        }
        this.selectedInlineMdElement = e;
        this.selectedInlineMdElement.classList.add("md-expand")
        return ;
    }

    
    bindClick(element: HTMLElement){
      element.addEventListener("click", (event: Event & { target: HTMLElement }) => {

        const r = rangy.getSelection().getRangeAt(0)
        console.log(r);
        console.log(r.collapsed);
        
        
        const topClassName = this.editor.ir.getRootElementClassName()

        let isInline = true;
            let e = findClosestByAttribute(event.target,"md-inline","",topClassName)
            if(!e){
              e = findClosestByAttribute(event.target,"md-block","",topClassName)
              isInline = false;
        }


        if(isInline){
          const inlineType = e.getAttribute("md-inline")
          
          if(inlineType === "img"){
            this.updateMdElement(e)
          }
        }

        //event.preventDefault();

        return true;
      })
    }

    bindSelectstartEvent(element: HTMLElement){
        element.addEventListener("selectstart", (event: Event & { target: HTMLElement }) => {

            
            const topClassName = this.editor.ir.getRootElementClassName()
            const r = rangy.getSelection().getRangeAt(0)
            const start =  r.startContainer
            
            
            let isInline = true;
            let e = findClosestByAttribute(start,"md-inline","",topClassName)
            if(!e){
              e = findClosestByAttribute(start,"md-block","",topClassName)
              isInline = false;
            }
            
            if(isInline){
              const inlineType = e.getAttribute("md-inline")
              
              if(inlineType === "link"){
                this.updateMdElement(e)
              }
            }
            
          },false)

    }

    bindEvent(element: HTMLElement): void {


        this.bindSelectstartEvent(element)
        this.bindClick(element)
    }

}

export default IRSelectBinder;