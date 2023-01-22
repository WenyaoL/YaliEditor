/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import Constants from '../constant/constants'

/**
 * 判断当前元素是否为md-inline
 * @param element 
 * @returns 
 */
export const isMdInline = (element: Element): boolean => {
  return element && element.hasAttribute(Constants.ATTR_MD_INLINE)
}

/**
 * 判断当前元素是否为md-block
 * @param element 
 * @returns 
 */
export const isMdBlock = (element: Element): boolean => {
  return element && element.hasAttribute(Constants.ATTR_MD_BLOCK)
}

export const isMdBlockFence = (element: Element) => {
  if (!isMdBlock(element)) return false
  if (element.getAttribute(Constants.ATTR_MD_BLOCK) == Constants.ATTR_MD_BLOCK_FENCE) return true
  return false
}

export const isMdBlockMath = (element: Element) => {
  if(!isMdBlock(element)) return false
  if (element.getAttribute(Constants.ATTR_MD_BLOCK) == Constants.ATTR_MD_BLOCK_MATH) return true
  return false
}

export const isMdBlockParagraph = (element: Element) => {
  if (!isMdBlock(element)) return false
  if (element.getAttribute(Constants.ATTR_MD_BLOCK) == Constants.ATTR_MD_BLOCK_PARAGRAPH) return true
  return false
}

export const isMdBlockTable = (element: Element) => {
  if (!isMdBlock(element)) return false
  if (element.getAttribute(Constants.ATTR_MD_BLOCK) == Constants.ATTR_MD_BLOCK_TABLE) return true
  return false
}

export const isMdBlockToc = (element: Element)=>{
  if (!isMdBlock(element)) return false
  if (element.getAttribute(Constants.ATTR_MD_BLOCK) == Constants.ATTR_MD_BLOCK_TOC) return true
  return false
}

export const isMdInlineImg = (element: Element) =>{
  if(!isMdInline(element)) return false
  if (element.getAttribute(Constants.ATTR_MD_INLINE) == Constants.ATTR_MD_INLINE_IMG) return true
  return false
} 

export const isMdInlineLink = (element: Element) =>{
  if(!isMdInline(element)) return false
  if (element.getAttribute(Constants.ATTR_MD_INLINE) == Constants.ATTR_MD_INLINE_LINK) return true
  return false
} 

/**
 * 判断当前fence块文本是否为空
 */
export const isEmptyMdFence = (element: Element) => {
  if (isMdBlockFence(element) && element.firstElementChild.getAttribute("is-empty") == "true") return true
  return false
}



/**
 * 获取某个element下面的所有heading（不深度查找，只查找其儿子节点）
 */
export function getAllHeading(root: HTMLElement) {
  let res: { type: string, content: string | null, id: string, level: number }[] = []

  //孩子节点
  let children = root.children
  for (let index = 0; index < children.length; index++) {
    const element = children[index];
    if (element.tagName == "H1") {
      res.push({ type: "h1", content: element.textContent, id: element.id, level: 1 })
    } else if (element.tagName == "H2") {
      res.push({ type: "h2", content: element.textContent, id: element.id, level: 2 })
    } else if (element.tagName == "H3") {
      res.push({ type: "h3", content: element.textContent, id: element.id, level: 3 })
    } else if (element.tagName == "H4") {
      res.push({ type: "h4", content: element.textContent, id: element.id, level: 4 })
    } else if (element.tagName == "H5") {
      res.push({ type: "h5", content: element.textContent, id: element.id, level: 5 })
    } else if (element.tagName == "H6") {
      res.push({ type: "h6", content: element.textContent, id: element.id, level: 6 })
    }
  }

  return res
}


