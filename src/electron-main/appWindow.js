/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import { BrowserWindow,nativeTheme} from 'electron'
import path from 'path'


function getThemeColor(theme){

    if(theme == "light") return "#ffffff"
    else if(theme == "dark") return "#333333"

    return "#ffffff"
}


export class AppWindow{

    

    constructor(manager){
        //窗口映射，可携带数据
        this.manager = manager
        this.theme = "light"
    }

    init(){
        this.theme = this.manager.store.get('theme','light')
        if(this.theme == "dark") nativeTheme.themeSource = "dark"
        else nativeTheme.themeSource = "light"
        
    }

    /**
     * 创建一个窗口
     */
    createWindow(title){
        if(!title){
            title = "Yalier"
        }
        
        const win = new BrowserWindow({
            width: 1000,
            height: 618,
            icon:path.join(__static,"yali.png"),
            title:title,
            backgroundColor:getThemeColor(this.theme),
            webPreferences: {
              webSecurity:false,
              //nodeIntegration:true,
              preload:path.join(__dirname,'preload.js'),
              enableRemoteModule: true,
              contextIsolation: true,
            }
        })
    
        win.on('close',(event)=>{
            event.preventDefault()
            //通知渲染进程要关闭窗口了，对数据进行保存操作
            win.webContents.send('closeWindow')
        })
    
        return win
    }
    /**
     * 切换所有窗口的主题
     */
    checkoutTheme(theme){
        BrowserWindow.getAllWindows().forEach(win=>{
            //通知窗口更新主题色
            win.webContents.send('selectTheme',{type:theme})
        })
        //将配置持久化
        this.manager.store.set('theme',theme)
        if(this.theme == "dark") nativeTheme.themeSource = "dark"
        else nativeTheme.themeSource = "light"
        this.theme = theme
    }

     hideSidebar(){
        BrowserWindow.getAllWindows().forEach(win=>{
            win.webContents.send('hideSidebar')
        })
     }
    
     expandSidebar(){
        BrowserWindow.getAllWindows().forEach(win=>{
            win.webContents.send('expandSidebar')
        })
     }


}

