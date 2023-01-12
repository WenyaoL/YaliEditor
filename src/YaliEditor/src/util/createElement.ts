import Constants from '../constant/constants'

export const strToElement = (src: string) => {
    const div = document.createElement("div")
    div.innerHTML = src
    return div.firstElementChild
}

export const strToElementList = (src: string) => {
    const div = document.createElement("div")
    div.innerHTML = src
    return div.children
}

export const strToElementArray = (src: string) => {
    return Array.from(strToElementList(src))
}

export const strToNodeArray = (src: string) => {
    return Array.from(strToNodeList(src))
}

export const strToNodeList = (src: string) => {
    const div = document.createElement("div")
    div.innerHTML = src
    return div.childNodes
}

export const strToDocumentFragment = (src: string) => {
    const list = strToNodeList(src)
    const nodeList: Node[] = Array.from(list)
    const documentFragment = document.createDocumentFragment()
    documentFragment.append(...nodeList)
    return documentFragment
}

export const createParagraph = () => {
    let p = document.createElement("p")
    p.setAttribute(Constants.ATTR_MD_BLOCK, Constants.ATTR_MD_BLOCK_PARAGRAPH)
    return p
}