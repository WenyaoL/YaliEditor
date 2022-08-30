import { ipcMain,dialog,BrowserWindow } from "electron";

import common from "./common";

function load(){

    
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
                    common.saveFile(select.filePath,applicationContext.content)
                })
            }else{
                //使用上下文的路径
                common.saveFile(applicationContext.filePath,applicationContext.content)
            }
        }else{
            //使用另存路径
            common.saveFile(path,applicationContext.content)
        }
    })


    //-------------------------注册处理器 handle-------------------------
    //处理读取文件内容
    ipcMain.handle('readFile',(event,payload)=>{
        //上下文
        const applicationContext =JSON.parse(payload.applicationContext)
        //指定路径
        const path = payload.path

        if(common.isEmpty(path)){
            if(common.isEmpty(applicationContext.filePath)){//零时决定路径
                //打开文件选择框
                common.openFileDialog().then(res=>{
                    if(res.canceled) return 
                    return common.openFile(res.filePaths[0])
                })
            }else{//使用上下文中路径
                common.openFile(applicationContext.filePath)
            }
        }else{//使用设定的路径
            return common.openFile(path)
        }   
    })

    
    //监听渲染进程的加载渲染上下文请求
    ipcMain.handle('loadRenderApplicationContext',(event,payload)=>{
        const applicationContext = common.loadRenderApplicationContext()
        return {applicationContext:applicationContext}
    })

    //弹窗文件保存提醒框
    ipcMain.handle('openSaveMsgDialog',(event,payload)=>{
        return dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(),{
            title:"保存",
            message:"是否保存更改\n请确保文件保存",
            buttons:["保存","丢弃"]
        })
    })

}

export {load}

export default {
    load
}

