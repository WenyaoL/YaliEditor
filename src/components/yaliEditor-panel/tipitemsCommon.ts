import YaLiEditor from "../../YaliEditor/src"
import rangy from "rangy"
import IR from "@/YaliEditor/src/ir"



export const createCommonItems=(disabled:boolean,editor:YaLiEditor):any[]=>{
    let items:any[]=[]

    if(disabled){
        return [
            { 
                label: "复制", 
                icon: 'el-icon-document-copy',
                disabled:disabled,
            },
            { 
                label: "粘贴", 
                icon: 'el-icon-delete',
                disabled:disabled,
            },
        ]
    }

    return [
        { 
            label: "复制", 
            icon: 'el-icon-document-copy',
            disabled:disabled,
            children: [
                { 
                    label: "复制为纯文本",
                    onClick: () => {
                        let event:any = new ClipboardEvent("copy",{clipboardData:new DataTransfer()})
                        event.info = "text"                 
                        editor.ir.rootElement.dispatchEvent(event)
                    }

                },{
                    label: "复制为markdown",
                    onClick: () => {
                        let event:any = new ClipboardEvent("copy",{clipboardData:new DataTransfer()})
                        event.info = "markdown"                 
                        editor.ir.rootElement.dispatchEvent(event)
                    }
                }
            ],
        },
        { 
            label: "粘贴", 
            icon: 'el-icon-delete',
            disabled:disabled,
        },
    ]
}


export const createTableItems=(disabled:boolean,editor:YaLiEditor)=>{
    return createCommonItems(disabled,editor).concat([
        { 
          label: "删除表格", 
        },
    ])
}


export const createImgItems=(disabled:boolean,editor:YaLiEditor)=>{
    return createCommonItems(disabled,editor).concat([
        { 
          label: "删除图片", 
        },
    ])
}

export const createParagraphItems=(disabled:boolean,editor:YaLiEditor)=>{
    return createCommonItems(disabled,editor).concat([
        { 
          label: "段落",
          children: [
            { 
                label: "一级标题",
                onClick: () => {
                    let key = new KeyboardEvent("keydown",{
                        key:"1"
                    })
                    editor.ir.hotkeyProcessor.headingKey(key)
                    editor.ir.focueProcessor.updateBookmark()
                }
            },{
                label: "二级标题",
                onClick: () => {
                    let key = new KeyboardEvent("keydown",{
                        key:"2"
                    })
                    editor.ir.hotkeyProcessor.headingKey(key)
                    editor.ir.focueProcessor.updateBookmark()
                }
            },{
                label: "三级标题",
                onClick: () => {
                    let key = new KeyboardEvent("keydown",{
                        key:"3"
                    })
                    editor.ir.hotkeyProcessor.headingKey(key)
                    editor.ir.focueProcessor.updateBookmark()
                }
            },{
                label: "四级标题",
                onClick: () => {
                    let key = new KeyboardEvent("keydown",{
                        key:"4"
                    })
                    editor.ir.hotkeyProcessor.headingKey(key)
                    editor.ir.focueProcessor.updateBookmark()
                }
            },{
                label: "五级标题",
                onClick: () => {
                    let key = new KeyboardEvent("keydown",{
                        key:"5"
                    })
                    editor.ir.hotkeyProcessor.headingKey(key)
                    editor.ir.focueProcessor.updateBookmark()
                }
            }
          ],
        },
        {
           label:"插入",
           children:[
            { 
                label: "代码块",
                onClick: () => {
                    editor.ir.hotkeyProcessor.codeblockKey(null)
                    editor.ir.focueProcessor.updateBookmark()
                }
            },
            {
                label: "公式块",
                onClick: () => {
                    editor.ir.hotkeyProcessor.mathKey(null)
                    editor.ir.focueProcessor.updateBookmark()
                }
            }
           ]
        }
    ])
}


export const createHeadItems=(disabled:boolean,editor:YaLiEditor)=>{
    return createCommonItems(disabled,editor).concat([
        { 
            label: "标题", 
            icon: 'el-icon-more-outline',
            children: [
                { 
                    label: "一级标题",
                    onClick: () => {
                        let key = new KeyboardEvent("keydown",{
                            key:"1"
                        })
                        editor.ir.hotkeyProcessor.headingKey(key)
                        editor.ir.focueProcessor.updateBookmark()
                    }
                },{
                    label: "二级标题",
                    onClick: () => {
                        let key = new KeyboardEvent("keydown",{
                            key:"2"
                        })
                        editor.ir.hotkeyProcessor.headingKey(key)
                        editor.ir.focueProcessor.updateBookmark()
                    }
                },{
                    label: "三级标题",
                    onClick: () => {
                        let key = new KeyboardEvent("keydown",{
                            key:"3"
                        })
                        editor.ir.hotkeyProcessor.headingKey(key)
                        editor.ir.focueProcessor.updateBookmark()
                    }
                },{
                    label: "四级标题",
                    onClick: () => {
                        let key = new KeyboardEvent("keydown",{
                            key:"4"
                        })
                        editor.ir.hotkeyProcessor.headingKey(key)
                        editor.ir.focueProcessor.updateBookmark()
                    }
                },{
                    label: "五级标题",
                    onClick: () => {
                        let key = new KeyboardEvent("keydown",{
                            key:"5"
                        })
                        editor.ir.hotkeyProcessor.headingKey(key)
                        editor.ir.focueProcessor.updateBookmark()
                    }
                }
            ],
        },
    ])
}