/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { ipcMain, dialog, BrowserWindow, shell } from "electron";

import common from "./common";
import path from 'path'
//import {font} from "@/assets/sourcehansans-normal-normal"
var context = {
    fonts: null
}


class MainIPMEventLoader {


    constructor(app) {
        this.context = {
            fonts: null
        }
        this.app = app
    }

    loadOnListener() {
        //-------------------------注册监听器 on-------------------------
        //处理文件保存事件
        ipcMain.on('renderer-saveFile', (event, {applicationContext,savePath}) => {
            //上下文
            applicationContext = JSON.parse(applicationContext)
            //另存路径
            savePath = savePath?savePath:applicationContext.filePath

            if(!savePath){
                this.app.appFileSystem.saveFileDialog().then(select => {
                    if (select.canceled) return
                    this.app.appFileSystem.saveFile(select.filePath,applicationContext.content)
                })
            }else{
                this.app.appFileSystem.saveFile(savePath, applicationContext.content)
            }
        })

        ipcMain.on("renderer-clearDataCache",(event)=>{
            this.app.clearDataCache()
        })

        ipcMain.on("renderer-setKeyMap",(event,keyMap)=>{
            this.app.setCurrKeyMap(keyMap)
        })

        //处理保持HTML文件事件
        ipcMain.on("renderer-saveHTMLFile", (event, {style,html}) => {
            const templatePath = path.join(__static, "templateHTML/TEM.html");
            const cssDirPath = path.join(__static, "css");

            let templateHtml = this.app.appFileSystem.openFileSync(templatePath)

            let cssPath = this.app.appFileSystem.openFileDirSync(cssDirPath).filter(str => {
                if (str.search(/app.*css$/i) > -1) return true
                return false
            })[0]
            let fileCss = this.app.appFileSystem.openFileSync(cssPath)
            style = `<style>${fileCss}</style>${style}`

            templateHtml = templateHtml.replace("${STYLE}", style).replace("${CONTENT}", html)

            this.app.appFileSystem.saveFileDialog([{ name: 'markdown', extensions: ['html'] }]).then(res => {
                if (res.canceled) return
                this.app.appFileSystem.saveFile(res.filePath, templateHtml)
            })
        })

        //关闭窗口
        ipcMain.on("renderer-closeWindow", (event, payload) => {
            let win = BrowserWindow.getFocusedWindow()
            if (!win) return
            this.app.appWindow.closeWindow(win)
            //win.destroy()
        })

        ipcMain.on("renderer-addRecentDocument", (event, payload) => {
            this.app.addRecentDocument(payload.filePath, payload.description)
        })

        //在一个新窗口打开文件
        ipcMain.on('renderer-openFileInNewWindow', (event, {filePath}) => {
            //打开文件
            const data = this.app.appFileSystem.openFileSync(filePath)
            //加入store,保存最近打开文件
            this.app.addRecentDocument(filePath, data.split("\n",3).join('\n').substring(0,30))
            //open new window
            const win = this.app.appWindow.editorWindowManager.createWindow(path.basename(filePath))
            //const win = common.openNewWindow()
            //this.app.appWindow.addWindow(win)
            //加载页面 window load url
            //页面加载完
            win.on('ready-to-show', () => {
                //发送数据main-setApplicationContext
                win.webContents.send('main-setApplicationContext', {   //上下文
                    title: path.basename(filePath),
                    filePath: filePath,   //文件路径(包含文件名)
                    content: data,
                    preview: "",
                    isSave: true,
                    theme: this.app.appWindow.theme,
                    recentDocuments: this.app.getRecentDocuments()
                })
            })
            common.loadUrl(win)
        })

        ipcMain.on('renderer-openURL', (event, payload) => {
            shell.openExternal(payload.url)
        })


        ipcMain.on('update-shortkeymap', (event, { keyMap }) => {
            this.app.setCurrKeyMap(keyMap)

        })

        ipcMain.on('renderer-test',(event,payload)=>{
            console.log("test==>",payload);
        })

    }

    loadHandleListener() {
        //-------------------------注册处理器 handle-------------------------
        //处理读取文件内容
        ipcMain.handle('renderer-readFile', (event, {filePath}) => {
            return this.app.appFileSystem.openFile(filePath)
        })

        ipcMain.handle('renderer-getFontsData',async (event)=>{
            if (!this.context['fonts']){
                this.context['fonts'] = await this.app.appFileSystem.readFontFile()
            }
            return this.context['fonts']
        })

        //监听渲染进程的加载渲染上下文请求（弃用）
        ipcMain.handle('loadRenderApplicationContext', (event, payload) => {
            const applicationContext = common.createRenderApplicationContext()
            if (argv.length == 2) {
                const filePath = argv[1]
                //标题
                applicationContext.title = path.basename(filePath)
                //文件路径
                applicationContext.filePath = filePath

                //applicationContext.tree = openFileTreeSync(path.dirname(filePath))
                if (process.env.WEBPACK_DEV_SERVER_URL) {
                    applicationContext.filePath = null
                } else {
                    //文件内容
                    applicationContext.content = this.app.appFileSystem.openFileSync(filePath)
                    //当前文件所在目录文件树
                    this.app.appFileSystem.createFileTree(path.dirname(filePath), applicationContext.tree)
                }
            }
            return { applicationContext: applicationContext }
        })

        ipcMain.handle('renderer-saveFile',async (event,{applicationContext,savePath})=>{
            //上下文
            applicationContext = JSON.parse(applicationContext)
            //另存路径
            savePath = savePath?savePath:applicationContext.filePath

            if(!savePath){
                const select = await this.app.appFileSystem.saveFileDialog()
                if (select.canceled) return false
                const err = await this.app.appFileSystem.saveFile(select.filePath,applicationContext.content)
                if(!err) return {savePath:select.filePath,title:path.basename(select.filePath)}
                return {err}
            }else{
                this.app.appFileSystem.saveFile(savePath, applicationContext.content)
            }
            return true
        })

        

        ipcMain.handle('renderer-getRecentDocuments', () => {
            return this.app.getRecentDocuments()
        })

        ipcMain.handle('renderer-getCurrTheme', () => {
            return this.app.appWindow.theme
        })

        //获取快捷键配置信息
        ipcMain.handle('renderer-getKeyMap', () => {
            return this.app.getCurrKeyMap()
        })

    }


    load() {
        this.loadOnListener()
        this.loadHandleListener()
    }

}




export { MainIPMEventLoader }

export default MainIPMEventLoader

