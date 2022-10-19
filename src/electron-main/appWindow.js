/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import { BrowserWindow} from 'electron'
import path from 'path'

export class AppWindow{

    constructor(manager){
        this.window = []
        this.manager = manager
    }

    init(){
        this.theme = this.manager.store.get('theme','light')
    }

    addWindow(win){
        this.window.push(win)
    }

    removeWindow(win){
        const idx = this.window.findIndex(value=>value===win)
        if(idx==-1) return;
        this.window.splice(idx,1)
    }
    
    /**
     * 创建一个窗口
     */
    createWindow(title){
        if(title == undefined){
            title = "Yalier"
        }
        const win = new BrowserWindow({
            width: 1000,
            height: 618,
            title:title,
            icon:path.join(__static,"yali.png"),
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
            this.removeWindow(win)
            //通知渲染进程要关闭窗口了，对数据进行保存操作
            win.webContents.send('closeWindow')
        })
    
        return win
    }
    /**
     * 切换所有窗口的主题
     */
    checkoutTheme(theme){
        this.window.forEach(win=>{
            //通知窗口更新主题色
            win.webContents.send('selectTheme',{type:theme})
        })
        //将配置持久化
        this.manager.store.set('theme',theme)
        this.theme = theme
    }


    
}