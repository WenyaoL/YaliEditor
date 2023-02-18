import { BrowserWindow, ipcMain } from 'electron'
import common from '../../common'
import path from 'path'
import { isOsx } from '../../config'

export default function (app, recentlyUsedFiles) {
    const fileMenus = { label: '文件(F)', submenu: [] }

    fileMenus.submenu.push(
        {
            label: '新建',//标签名
            accelerator: 'ctrl+n',//快捷键
            click: () => {
                //open new window
                const win = app.appWindow.editorWindowManager.createWindow("Yalier")
                //加载页面 window load url
                common.loadUrl(win).then(() => {
                    const applicationContext = common.createRenderApplicationContext()
                    applicationContext.theme = app.appWindow.theme
                    applicationContext.recentDocuments = app.getRecentDocuments()
                    //发送数据
                    win.webContents.send('main-setApplicationContext', applicationContext)
                })
            }
        },
        { type: 'separator' },
        {
            label: '打开',
            accelerator: 'ctrl+o',
            click: async () => {
                //打开文件对话框
                const select = await app.appFileSystem.openFileDialog()
                const filePath = select.filePaths[0]
                //打开文件
                const data = app.appFileSystem.openFileSync(filePath)
                //加入store,保存最近打开文件
                app.addRecentDocument(filePath, data.split("\n", 3).join('\n').substring(0, 30))
                //open new window
                const win = app.appWindow.editorWindowManager.createWindow(path.basename(filePath))
                //页面加载完，窗口可以展示时
                ///win.on('ready-to-show',()=>{})
                //加载页面 window load url
                common.loadUrl(win).then(() => {//页面加载完立刻发送数据
                    //发送数据
                    win.webContents.send('main-setApplicationContext', {   //上下文
                        title: path.basename(filePath),
                        filePath: filePath,   //文件路径(包含文件名)
                        content: data,
                        preview: "",
                        isSave: true,
                        theme: app.appWindow.theme,
                        recentDocuments: app.getRecentDocuments()
                    })
                })

            }
        },
        {
            label: '打开文件夹',
            click: () => {
                const select = app.appFileSystem.openFileDirDialogSync()
                if (select != undefined) {
                    let tree = app.appFileSystem.openFileTreeSync(select[0], 8)
                    tree = app.appFileSystem.filterFileTree(tree)
                    BrowserWindow.getFocusedWindow().webContents.send('main-createFileTree', { tree: tree })
                }
            }
        }
    )


    if (!isOsx) {
        const recentdocumentsMenu = {
            label: '最近打开文件',
            submenu: []
        }

        recentlyUsedFiles.forEach(fileInfo => {
            const filePath = path.join(fileInfo.dirName, fileInfo.fileName)
            recentdocumentsMenu.submenu.push({
                label: filePath,
                click: () => {
                    ipcMain.emit('renderer-openFileInNewWindow', null, { filePath })
                }
            })

        })

        recentdocumentsMenu.submenu.push({
            label: "清空最近文件",
            click: () => {
                app.clearRecentDocuments()
            }
        })
        fileMenus.submenu.push(recentdocumentsMenu)
    } else {
        fileMenus.submenu.push({
            role: 'recentdocuments',
            submenu: [
                {
                    role: 'clearrecentdocuments'
                }
            ]
        })
    }


    fileMenus.submenu.push(
        { type: 'separator' },
        {
            label: '保存',
            accelerator: 'ctrl+s',
            click: () => {
                //触发保存事件
                BrowserWindow.getFocusedWindow()
                    .webContents
                    .send('main-saveFile')
            }
        }, {
        label: '另存为',
        accelerator: 'ctrl+shift+s',
        click: async () => {
            //打开文件对话框
            const select = await app.appFileSystem.saveFileDialog()
            //发送catchContent事件,渲染进程会回传数据，并在主进程的监听器中处理数据保存
            BrowserWindow.getFocusedWindow().webContents.send('main-saveAsFile', { path: select.filePath })
        }
    },
        { type: 'separator' },
        {
            label: '导出',
            submenu: [
                { label: 'PDF', click: () => { BrowserWindow.getFocusedWindow().webContents.send('main-exportPDF') } },
                { label: '图片(png)', click: () => { BrowserWindow.getFocusedWindow().webContents.send('main-exportIMG') } },
                { label: 'HTML', click: () => { BrowserWindow.getFocusedWindow().webContents.send('main-exportHTML') } },
            ]
        },
        { type: 'separator' },
        {
            label: '爱好设置',
            click: () => {

                const win = app.appWindow.settingWindowManager.createUnframeWindow('Yali preference setting')
                if (win) common.loadPreferenceSettingUrl(win)
            }
        },
        { type: 'separator' },
        {
            label: '加载',
            accelerator: 'ctrl+l',
            click: async () => {
                //打开文件对话框
                const select = await app.appFileSystem.openFileDialog()
                const filePath = select.filePaths[0]
                //打开文件
                const data = app.appFileSystem.openFileSync(filePath)
                //加入store,保存最近打开文件
                app.addRecentDocument(filePath, data.substring(0, 30))
                BrowserWindow
                    .getFocusedWindow()
                    .webContents
                    .send('main-setApplicationContext', {   //上下文
                        title: path.basename(filePath),
                        filePath: filePath,   //文件路径
                        content: data,
                        preview: "",
                        isSave: true
                    })
            }
        },
        {
            label: '关闭',
            accelerator: 'ctrl+w',
            click: () => {
                let win = BrowserWindow.getFocusedWindow()
                win.close()
            }
        }
    )

    return fileMenus
}


