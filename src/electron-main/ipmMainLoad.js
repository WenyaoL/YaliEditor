/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { ipcMain,dialog,BrowserWindow,shell } from "electron";

import common from "./common";
import path from 'path'
//import {font} from "@/assets/sourcehansans-normal-normal"
var context = {
    fonts:null
}


class MainIPMEventLoader{
    

    constructor(manager){
        this.context = {
            fonts:null
        }
        this.manager = manager
    }

    loadOnListener(){
        //-------------------------注册监听器 on-------------------------
        //处理保存事件的回传
        ipcMain.on('saveFile',(event,payload)=>{
            //上下文
            const applicationContext = JSON.parse(payload.applicationContext)
            //另存路径
            const path = payload.path
    
            if(common.isEmpty(path)){
                //上下文中是否存在路径
                if(common.isEmpty(applicationContext.filePath)){
                    //选择
                    common.saveFileDialog().then(select=>{
                        if(select.canceled) return
                        common.saveFile(select.filePath,
                            applicationContext.content,
                            {closeWindow:payload.closeWindow}
                            )
                    })
                }else{
                    //使用上下文的路径
                    common.saveFile(applicationContext.filePath,applicationContext.content,{closeWindow:payload.closeWindow})
                }
            }else{
                //使用另存路径
                common.saveFile(path,applicationContext.content,{closeWindow:payload.closeWindow})
            }
        })
    
        //处理渲染进程的字体加载请求
        ipcMain.on('loadFonts',(event,payload)=>{
            //字体数据
            //event.reply('initFonts',context['fonts'])
            if(this.context['fonts']){
                event.reply('initFonts',this.context['fonts'])
                return
            }
            common.readFontFile().then(data=>{
                this.context['fonts'] = data
                event.reply('initFonts',data)
            })
        })
    
        ipcMain.on("saveHTMLFile",(event,payload)=>{
            const templatePath = path.join(__static,  "templateHTML/TEM.html");
            const cssDirPath = path.join(__static,  "css");
            let html = common.openFileSync(templatePath)
            let cssPath = common.openFileDirSync(cssDirPath).filter(str=>{
                if(str.search(/app.*css$/i)>-1) return true
                return false
            })[0]
            let css= common.openFileSync(cssPath)
            let style = '<style>'+css+'</style>'
            style += style+payload.style
            html = html.replace("${STYLE}",style).replace("${CONTENT}",payload.html)
    
            common.saveFileDialog([{name:'markdown',extensions:['html']}]).then(res=>{
                if(res.canceled) return
                common.saveFile(res.filePath,html)
            })
        })
    
        //关闭窗口
        ipcMain.on("close-window",(event,payload)=>{
            let win = BrowserWindow.getFocusedWindow()
            if(!win) return
            win.removeAllListeners('close')
            win.close()
        })

        ipcMain.on("add-recent-document",(event,payload)=>{
            this.manager.addRecentDocument(payload.filePath,payload.description)
        })

        //在一个新窗口打开文件
        ipcMain.on('openFileInNewWindow',(event,payload)=>{
            //指定路径
            const filePath = payload.path
            //打开文件
            const data = common.openFileSync(filePath)
            //加入store,保存最近打开文件
            this.manager.addRecentDocument(filePath,data.substring(0,30))
            //open new window
            const win = this.manager.appWindow.createWindow(path.basename(filePath))
            //const win = common.openNewWindow()
            //this.manager.appWindow.addWindow(win)
            //加载页面 window load url
            common.loadUrl(win)
            //页面加载完
            win.on('ready-to-show',()=>{
                //发送数据
                win.webContents.send('updateApplicationContext',{   //上下文
                    title:path.basename(filePath),
                    filePath: filePath,   //文件路径(包含文件名)
                    content:data,
                    preview:"",  
                    isSave:true,
                    theme:this.manager.appWindow.theme,
                    recentDocuments:this.manager.getRecentDocuments()
                })
            })

        })
    }

    loadHandleListener(){
        //-------------------------注册处理器 handle-------------------------
        //处理读取文件内容
        ipcMain.handle('readFile',(event,payload)=>{

            //指定路径
            const path = payload.path
            return common.openFile(path)
        })
    


        //监听渲染进程的加载渲染上下文请求
        ipcMain.handle('loadRenderApplicationContext',(event,payload)=>{
            const applicationContext = common.loadRenderApplicationContext()
            return {applicationContext:applicationContext}
        })
    
        //弹窗文件保存提醒框（弃用）
        ipcMain.handle('openSaveMsgDialog',(event,payload)=>{
            return dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(),{
                title:"保存",
                message:"是否保存更改\n请确保文件保存",
                buttons:["保存","丢弃"]
            })
        })
        
    
        ipcMain.handle('openURL',(event,payload)=>{
            shell.openExternal(payload.url)
        })
    
        ipcMain.handle("openHelpDocumentation",()=>{
            return common.openFileSync(path.join(__static,"docs/Help.md"))
        })

        ipcMain.handle('getRecentDocuments',()=>{
            return this.manager.getRecentDocuments()
        })
    }


    load(){
        this.loadOnListener()
        this.loadHandleListener()
    }

}




export {MainIPMEventLoader}

export default MainIPMEventLoader

