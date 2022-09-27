/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import Constants from "../constants";


/**
 * find  the closest element 
 * 查找最近的元素
 * @param element 
 * @param className 
 * @returns 
 */
export const findClosestByClassName = (element: Node|null, className: string,stopClassName: string) => {
    if (!element || !stopClassName) {
        return null;
    }
    if (element.nodeType === 3) {
        element = element.parentElement;
    }
    let e = element as HTMLElement;
    while (e && !e.classList.contains(stopClassName)) {
        if (e.classList.contains(className)) {
            return e;
        } else {
            e = e.parentElement;
        }
    }
    return null;
};

export const findClosestByTagName = (element: Node|null, tagName: string,stopClassName: string)=>{
    if (!element || !stopClassName) {
        return null;
    }
    if (element.nodeType === 3) {
        element = element.parentElement;
    }
    let e = element as HTMLElement;
    while (e && !e.classList.contains(stopClassName)) {
        if (e.tagName === tagName) {
            return e;
        } else {
            e = e.parentElement;
        }
    }
    return null;
}


/**
 * 找到顶层元素
 * @param element 
 * @param topClassName 
 * @returns 
 */
export const findClosestByTop = (element: Node,topClassName: string) => {
    if (!element) {
        return null;
    }
    if (element.nodeType === 3) { 
        element = element.parentElement;
    }
    let e = element as HTMLElement;
    //向外递归（节点为空，或者找到属性节点才停止）
    while (e && !e.classList.contains(topClassName)) {
        //包含该属性时，标志为true
        if (e.parentElement.classList.contains(topClassName)) {
            return e
        } else {
            //递归父节点
            e = e.parentElement;
        }
    }
    return null;
    };

/**
 * 查找最近的元素，包含Attribute
 * @param element 
 * @param attr 
 * @param value 
 * @param stopClassName 
 * @returns 
 */
export const findClosestByAttribute = (element: Node, attr: string, value: string,stopClassName: string) => {
    if (!element) {
        return null;
    }
    if (element.nodeType === 3) {
        element = element.parentElement;
    }
    let e = element as HTMLElement;
    if(value === null) value = "";
    //向外递归（节点为空，或者找到属性节点才停止）
    while (e && !e.classList.contains(stopClassName)) {
        //包含该属性时，标志为true
        if(value === "" && e.getAttribute(attr) !== null){
            return e;
        }else if (e.getAttribute(attr) === value) {
            return e
        }else {
            //递归父节点
            e = e.parentElement;
        }
    }
    return null;
};


/**
 * 查找IR模式下的最近的元素节点
 * @param element 
 */
export const findClosest = (element: Node,stopClassName: string)=>{
    if (!element) {
        return null;
    }
    let e = element
    e = findClosestByAttribute(e,Constants.ATTR_MD_INLINE,"",stopClassName)
    if(!e) findClosestByAttribute(e,Constants.ATTR_MD_BLOCK,"",stopClassName)
    if(!e) findClosestByTop(e,stopClassName)
    return e
}


export const IRfindClosestMdBlock = (element: Node)=>{
    return findClosestByAttribute(element,Constants.ATTR_MD_BLOCK,"",Constants.IR_CLASS_NAME)
}

export const IRfindClosestMdInline = (element: Node)=>{
    return findClosestByAttribute(element,Constants.ATTR_MD_INLINE,"",Constants.IR_CLASS_NAME)
}

export const IRfindClosestTop = (element: Node)=>{
    return findClosestByTop(element,Constants.IR_CLASS_NAME)
}

export const IRfindClosestLi = (element: Node)=>{
    return findClosestByTagName(element,"LI",Constants.IR_CLASS_NAME)
}

export const IRfindClosestList = (element: Node)=>{
    let e = findClosestByTagName(element,"OL",Constants.IR_CLASS_NAME)
    if(!e) e = findClosestByTagName(element,"UL",Constants.IR_CLASS_NAME)
    return e;
}

export const IRfindClosestParagraph = (element: Node)=>{
    return findClosestByAttribute(element,Constants.ATTR_MD_BLOCK,Constants.ATTR_MD_BLOCK_PARAGRAPH,Constants.IR_CLASS_NAME)
}

export const IRfindClosestFence = (element: Node)=>{
    return findClosestByAttribute(element,Constants.ATTR_MD_BLOCK,Constants.ATTR_MD_BLOCK_FENCE,Constants.IR_CLASS_NAME)
}