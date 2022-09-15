import { findClosestByAttribute } from "./findElement";

export const isInline = (element:Node,stopClassName:string):boolean=>{
    let isInline = true;
    let e = findClosestByAttribute(element,"md-inline","",stopClassName)
    if(!e){
      e = findClosestByAttribute(element,"md-block","",stopClassName)
      isInline = false;
    }
    return isInline
}


export const strToElement =(src:string)=>{
    const div = document.createElement("div")
    div.innerHTML = src
    return div.firstChild
}