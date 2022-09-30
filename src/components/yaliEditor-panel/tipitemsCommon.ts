import YaLiEditor from "../../YaliEditor/src"

export const createCommonItems=(disabled:boolean):any[]=>{
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

                },{
                    label: "复制为markdown",
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


export const createTableItems=(disabled:boolean)=>{
    return createCommonItems(disabled).concat([
        { 
          label: "删除表格", 
        },
    ])
}


export const createImgItems=(disabled:boolean)=>{
    return createCommonItems(disabled).concat([
        { 
          label: "删除图片", 
        },
    ])
}

export const createHeadItems=(disabled:boolean,editor:YaLiEditor)=>{
    return createCommonItems(disabled).concat([
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