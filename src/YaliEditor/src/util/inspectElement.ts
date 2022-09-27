/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { findClosestByAttribute } from "./findElement";
import Constants from '../constants'

export const isInline = (element:Node,stopClassName:string):boolean=>{
    let isInline = true;
    let e = findClosestByAttribute(element,"md-inline","",stopClassName)
    if(!e){
      e = findClosestByAttribute(element,"md-block","",stopClassName)
      isInline = false;
    }
    return isInline
}

export const isBlockMdFence = (element:Element)=>{

  if(!element || !element.hasAttribute(Constants.ATTR_MD_BLOCK)) return false


  if(element.getAttribute(Constants.ATTR_MD_BLOCK) == Constants.ATTR_MD_BLOCK_FENCE) return true
  
  return false

}


export const strToElement =(src:string)=>{
    const div = document.createElement("div")
    div.innerHTML = src
    return div.firstChild
}



export const createParagraph = ()=>{
  let p = document.createElement("p")
  p.setAttribute(Constants.ATTR_MD_BLOCK,Constants.ATTR_MD_BLOCK_PARAGRAPH)
  return p
}

/**
 * 获取某个element下面的所有heading（不深度查找，只查找其儿子节点）
 */
export function getAllHeading(root:HTMLElement){
  let res:{type:string,content:string|null,id:string,level:number}[] = []

  //孩子节点
  let children = root.children
  for (let index = 0; index < children.length; index++) {
    const element = children[index];
    if(element.tagName == "H1"){
      res.push({type:"h1",content:element.textContent,id:element.id,level:1})
    }else if(element.tagName == "H2"){
      res.push({type:"h2",content:element.textContent,id:element.id,level:2})
    }else if(element.tagName == "H3"){
      res.push({type:"h3",content:element.textContent,id:element.id,level:3})
    }else if(element.tagName == "H4"){
      res.push({type:"h4",content:element.textContent,id:element.id,level:4})
    }else if(element.tagName == "H5"){
      res.push({type:"h5",content:element.textContent,id:element.id,level:5})
    }else if(element.tagName == "H6"){
      res.push({type:"h6",content:element.textContent,id:element.id,level:6})
    }
  }

  return res
}


