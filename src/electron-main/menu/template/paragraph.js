import { BrowserWindow } from 'electron'

export default function () {
    return {
        label: '段落(P)',
        submenu: [
            {
                label: '一级标题', accelerator: 'ctrl+1', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createLine', { type: "head", level: 1 })
                }
            },
            {
                label: '二级标题', accelerator: 'ctrl+2', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createLine', { type: "head", level: 2 })
                }
            },
            {
                label: '三级标题', accelerator: 'ctrl+3', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createLine', { type: "head", level: 3 })
                }
            },
            {
                label: '四级标题', accelerator: 'ctrl+4', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createLine', { type: "head", level: 4 })
                }
            },
            {
                label: '五级标题', accelerator: 'ctrl+5', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createLine', { type: "head", level: 5 })
                }
            },
            {
                label: '六级标题', accelerator: 'ctrl+6', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createLine', { type: "head", level: 6 })
                }
            },
            { type: 'separator' },
            {
                label: '代码块', accelerator: 'ctrl+shift+k', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createBlock', { type: "codeblock" })
                }
            },
            {
                label: '公式块', accelerator: 'ctrl+shift+M', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createBlock', { type: "mathblock" })
                }
            },
            {
                label: 'HTML块', accelerator: 'ctrl+shift+H', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createBlock', { type: "htmlblock" })
                }
            },
            { type: 'separator' },
            {
                label: '有序列表', accelerator: 'ctrl+shift+[', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createMulLine', { type: "list" })
                }
            },
            {
                label: '无序列表', accelerator: 'ctrl+shift+]', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createMulLine', { type: "unlist" })
                }
            },
            { type: 'separator' },
            {
                label: '引用', accelerator: 'ctrl+shift+q', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createMulLine', { type: "quote" })
                }
            },
            {
                label: '目录', accelerator: 'ctrl+shift+t', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createToc')
                }
            },
            {
                label: '创建表格', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createTable')
                }
            }
        ]
    }
}
