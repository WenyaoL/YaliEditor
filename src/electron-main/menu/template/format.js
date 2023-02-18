import { BrowserWindow } from 'electron'

export default function (shortKeymap) {
    const strong = shortKeymap.get('format.strong')
    const italic = shortKeymap.get('format.italic')
    const underline = shortKeymap.get('format.underline')
    const deleteline = shortKeymap.get('format.deleteline')
    const inlineCode = shortKeymap.get('format.inline-code')

    return {
        label: '格式(O)',
        submenu: [
            {
                label: '加粗', accelerator: strong?strong:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createType', { type: "blod" })
                }
            },
            {
                label: '下划线', accelerator: underline?underline:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createType', { type: "underline" })
                }
            },
            {
                label: '斜体', accelerator: italic?italic:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createType', { type: "italic" })
                }
            },
            {
                label: '代码', accelerator: inlineCode?inlineCode:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createType', { type: "codeline" })
                }
            },
            {
                label: '删除线', accelerator: deleteline?deleteline:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createType', { type: "deleteline" })
                }
            },
        ]
    }
}

