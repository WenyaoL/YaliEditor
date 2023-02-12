/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

export const _YALI_VERSION : string =  "YaLier_1.0.0"


export const CLASS_MD_HIDEN : string = "md-hiden"
export const CLASS_MD_META : string = "md-meta"
export const CLASS_MD_BORDER :string = "md-border"
export const CLASS_MARKDOWN_IT_CODE_BEAUTIFUL: string = "markdown-it-code-beautiful"

/**
 * 聚焦class
 */
export const CLASS_MD_FOCUS : string = "md-focus"
export const CLASS_MD_EXPAND : string = "md-expand"

/**
 * md-block的属性块
 */
export const ATTR_MD_BLOCK : string = "md-block"
export const ATTR_MD_BLOCK_HEADING : string = "heading"
export const ATTR_MD_BLOCK_PARAGRAPH : string = "paragraph" 
export const ATTR_MD_BLOCK_TOC:string = "toc"
export const ATTR_MD_BLOCK_TABLE : string = "table" 
export const ATTR_MD_BLOCK_FENCE : string = "fence" 
export const ATTR_MD_BLOCK_MATH : string = "math"
export const ATTR_MD_BLOCK_HR : string = "hr"
export const ATTR_MD_BLOCK_CODE : string = "code"
export const ATTR_MD_BLOCK_META : string = "meta"
export const ATTR_MD_BLOCK_HTML  : string = "html"
export const ATTR_MD_BLOCK_ORDERED_LIST : string = "ordered_list"
export const ATTR_MD_BLOCK_BULLET_LIST : string = "bullet_list"
export const ATTR_MD_BLOCK_LIST_ITEM : string = "list_item"
export const ATTR_MD_BLOCK_BLOCKQUOTE : string = "blockquote"

/**
 * md-inline的属性块
 */
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
 * md-like的属性块
 */
 export const ATTR_MD_LIKE : string = "md-like"

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

/**
 * refreshToc 刷新标题事件
 */
export const IR_EVENT_REFRESHTOC:string = "refreshToc"

/**
 * codeinput 在代码块输入时触发的事件（打字不触发，英文输入时触发）
 */
export const IR_EVENT_CODEBLOCKINPUT:string = "codeBlockInput"

export default {
    _YALI_VERSION,
    CLASS_MD_HIDEN,
    CLASS_MD_META,
    CLASS_MD_BORDER,
    CLASS_MARKDOWN_IT_CODE_BEAUTIFUL,
    CLASS_MD_FOCUS,
    CLASS_MD_EXPAND,
    ATTR_MD_BLOCK,
    ATTR_MD_BLOCK_HEADING,
    ATTR_MD_BLOCK_PARAGRAPH,
    ATTR_MD_BLOCK_TOC,
    ATTR_MD_BLOCK_TABLE,
    ATTR_MD_BLOCK_FENCE,
    ATTR_MD_BLOCK_MATH,
    ATTR_MD_BLOCK_HR,
    ATTR_MD_BLOCK_CODE,
    ATTR_MD_BLOCK_META,
    ATTR_MD_BLOCK_HTML,
    ATTR_MD_BLOCK_ORDERED_LIST,
    ATTR_MD_BLOCK_BULLET_LIST,
    ATTR_MD_BLOCK_LIST_ITEM,
    ATTR_MD_BLOCK_BLOCKQUOTE,
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
    ATTR_MD_LIKE,
    CODEMIRROR_LINE,
    CODEMIRROR_CONTENT,
    CODEMIRROR_EDITOR,
    IR_CLASS_NAME,
    IR_EVENT_REFRESHTOC,
    IR_EVENT_CODEBLOCKINPUT
}