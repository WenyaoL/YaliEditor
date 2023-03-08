import { BrowserWindow, shell  } from 'electron'
import common from '../../common'
import path from 'path'

export default function (app) {
    const i18n = app.appI18n
    return {
        label: i18n.t('ABOUT_'),
        submenu: [
            {
                label: i18n.t('ABOUT_author'), click: () => {
                    BrowserWindow.getFocusedWindow().webContents.send("main-openAuthorDetails")
                }
            },
            {
                label: i18n.t('ABOUT_Help'), click: () => {
                    //打开文件
                    const filePath = path.join(__static, "docs/Help.md")
                    const data = app.appFileSystem.openFileSync(filePath)
                    //open new window
                    const win = app.appWindow.editorWindowManager.createWindow(path.basename(filePath))
                    //加载页面 window load url
                    common.loadUrl(win).then(() => {
                        win.webContents.send('main-setApplicationContext', {   //上下文
                            title: path.basename(filePath),
                            filePath: filePath,   //文件路径
                            content: data,
                            preview: "",
                            isSave: true,
                            theme: app.appWindow.theme
                        })
                    })
                }
            },
            {
                label: i18n.t('ABOUT_History'), click: () => {
                    //打开文件
                    const filePath = path.join(__static, "docs/Development.md")
                    const data = app.appFileSystem.openFileSync(filePath)
                    //open new window
                    const win = app.appWindow.editorWindowManager.createWindow(path.basename(filePath))
                    //加载页面 window load url
                    common.loadUrl(win).then(() => {
                        //发送数据
                        win.webContents.send('main-setApplicationContext', {   //上下文
                            title: path.basename(filePath),
                            filePath: filePath,   //文件路径
                            content: data,
                            preview: "",
                            isSave: true,
                            theme: app.appWindow.theme
                        })
                    })
                }
            },
            {
                label: i18n.t('ABOUT_Github'), click: () => {
                    shell.openExternal('https://github.com/WenyaoL/YaliEditor')
                }
            },
            {
                label: i18n.t('ABOUT_openDevTools'), click: () => {
                    BrowserWindow.getFocusedWindow().webContents.openDevTools()
                }
            },

        ]
    }
}