import { getUniqueKey } from '@/markdown-it-plugin/markdown-it-key-generator'
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
    const p = document.createElement("p")
    p.setAttribute("mid", getUniqueKey() + "")
    p.setAttribute(Constants.ATTR_MD_BLOCK, Constants.ATTR_MD_BLOCK_PARAGRAPH)
    p.className = ""
    return p
}

export const createBlockquote = () => {
    const quote = document.createElement("blockquote")
    quote.setAttribute("mid", getUniqueKey() + "")
    quote.setAttribute(Constants.ATTR_MD_BLOCK, Constants.ATTR_MD_BLOCK_BLOCKQUOTE)
    return quote
}

export const createOrderList = () => {
    const orderList = document.createElement("ol")
    orderList.setAttribute("mid", getUniqueKey() + "")
    orderList.setAttribute(Constants.ATTR_MD_BLOCK, Constants.ATTR_MD_BLOCK_ORDERED_LIST)
    return orderList
}

export const createBulletList = () => {
    const bulletList = document.createElement("ul")
    bulletList.setAttribute("mid", getUniqueKey() + "")
    bulletList.setAttribute(Constants.ATTR_MD_BLOCK, Constants.ATTR_MD_BLOCK_BULLET_LIST)
    return bulletList
}

export const createMdList = (name: string) => {
    if (!name) return
    name = name.toLowerCase()
    if (name == "ol") return createOrderList()
    if (name == "ul") return createBulletList()
}