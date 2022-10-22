/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

export const _YALI_VERSION : string =  "YaLier_1.0.0"


export const CLASS_MD_HIDEN : string = "md-hiden"
export const CLASS_MD_META : string = "md-meta"

export const CLASS_MD_CODE: string = "markdown-it-code-beautiful"


export const ATTR_MD_BLOCK : string = "md-block"
export const ATTR_MD_BLOCK_HEADING : string = "heading"
export const ATTR_MD_BLOCK_PARAGRAPH : string = "paragraph" 
export const ATTR_MD_BLOCK_TOC:string = "toc"
export const ATTR_MD_BLOCK_TABLE : string = "table" 
export const ATTR_MD_BLOCK_FENCE : string = "fence" 
export const ATTR_MD_BLOCK_MATH : string = "math" 

export const ATTR_MD_INLINE : string = "md-inline"
export const ATTR_MD_INLINE_IMG : string = "img"
export const ATTR_MD_INLINE_LINK : string = "link"
export const ATTR_MD_INLINE_UNDERLINE : string = "underline"
export const ATTR_MD_INLINE_EM : string = "em"
export const ATTR_MD_INLINE_CODE : string = "code"
export const ATTR_MD_INLINE_DELETELINE : string = "deleteline"
export const ATTR_MD_INLINE_STRONG : string = "strong"

export const SELECTOR_MD_INLINE_LINK : string = "span[md-inline=link]"
export const SELECTOR_MD_INLINE_IMG : string = "span[md-inline=img]"

/**
 * cm-line
 */
export const CODEMIRROR_LINE :string = "cm-line"
/**
 * cm-content
 */
export const CODEMIRROR_CONTENT : string = "cm-content"
/**
 * cm-editor
 */
export const CODEMIRROR_EDITOR : string = "cm-editor"

export const IR_CLASS_NAME:string = "YaLi-ir"


export const IR_EVENT_REFRESHTOC:string = "refreshToc"

export default {
    _YALI_VERSION,
    CLASS_MD_HIDEN,
    CLASS_MD_META,
    CLASS_MD_CODE,
    ATTR_MD_BLOCK,
    ATTR_MD_BLOCK_HEADING,
    ATTR_MD_BLOCK_PARAGRAPH,
    ATTR_MD_BLOCK_TOC,
    ATTR_MD_BLOCK_TABLE,
    ATTR_MD_BLOCK_FENCE,
    ATTR_MD_BLOCK_MATH,
    ATTR_MD_INLINE,
    ATTR_MD_INLINE_IMG,
    ATTR_MD_INLINE_LINK,
    ATTR_MD_INLINE_UNDERLINE,
    ATTR_MD_INLINE_EM,
    ATTR_MD_INLINE_CODE,
    ATTR_MD_INLINE_DELETELINE,
    ATTR_MD_INLINE_STRONG,
    SELECTOR_MD_INLINE_LINK,
    SELECTOR_MD_INLINE_IMG,
    CODEMIRROR_LINE,
    CODEMIRROR_CONTENT,
    CODEMIRROR_EDITOR,
    IR_CLASS_NAME,
    IR_EVENT_REFRESHTOC
}