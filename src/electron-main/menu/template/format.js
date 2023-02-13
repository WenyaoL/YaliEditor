import { BrowserWindow } from 'electron'

export default function () {
    return {
        label: '格式(O)',
        submenu: [
            {
                label: '加粗', accelerator: 'ctrl+b', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createType', { type: "blod" })
                }
            },
            {
                label: '下划线', accelerator: 'ctrl+u', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createType', { type: "underline" })
                }
            },
            {
                label: '斜体', accelerator: 'ctrl+i', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createType', { type: "italic" })
                }
            },
            {
                label: '代码', accelerator: 'ctrl+shift+`', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createType', { type: "codeline" })
                }
            },
            {
                label: '删除线', accelerator: 'ctrl+shift+5', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('createType', { type: "deleteline" })
                }
            },
        ]
    }
}

