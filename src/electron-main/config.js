export const isOsx = process.platform === 'darwin'
export const isWindows = process.platform === 'win32'
export const isLinux = process.platform === 'linux'


export const defaultKeyMap = new Map([
    ["edit.undo", "ctrl+z"],
    ["edit.redo", "ctrl+y"],

    ["paragraph.heading-1", "ctrl+1"],
    ["paragraph.heading-2", "ctrl+2"],
    ["paragraph.heading-3", "ctrl+3"],
    ["paragraph.heading-4", "ctrl+4"],
    ["paragraph.heading-5", "ctrl+5"],
    ["paragraph.heading-6", "ctrl+6"],

    ["paragraph.order-list", "ctrl+shift+{"],
    ["paragraph.bullet-list", "ctrl+shift+}"],
    ["paragraph.toc", "ctrl+shift+t"],
    ["paragraph.html-block", "ctrl+shift+h"],
    ["paragraph.math-block", "ctrl+shift+m"],
    ["paragraph.reduceIndent-list", "ctrl+["],
    ["paragraph.addIndent-list", "ctrl+]"],
    ["paragraph.code-fence", "ctrl+shift+k"],
    ["paragraph.quote-block", "ctrl+shift+q"],

    ["format.strong", "ctrl+b"],
    ["format.italic", "ctrl+i"],
    ["format.underline", "ctrl+u"],
    ["format.deleteline", "ctrl+shift+%"],
    ["format.inline-code", "ctrl+shift+~"],

    ["model.IR","ctrl+n"],
    ["model.SV","ctrl+,"],
    ["model.ONLY","ctrl+m"],
])


export const defaultApplicationContext = (()=>{
    return {   //上下文
        theme: "light",   //主题
        title: "Yalier",  //标题
        filePath: null,   //文件路径
        content: "",
        preview: "",
        tree: [],   //当前文件树
        isSave: true,
        outline: [],  //文档大纲
        recentDocuments: [], //最近打开文件
    }
})()