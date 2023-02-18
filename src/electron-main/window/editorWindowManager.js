import { BrowserWindow, nativeTheme } from 'electron'
import path from 'path'
class EditorWindowManager {
    
    constructor(appwindow) {
        this.appwindow = appwindow
        //窗口映射，可携带数据
        this._windows = new Array(5)
    }


    /**
     * 创建一个窗口
     */
    createWindow(title) {
        if (!title) {
            title = "Yalier"
        }
        
        const win = new BrowserWindow({
            width: 1000,
            height: 618,
            icon: path.join(__static, "yali.png"),
            title: title,
            backgroundColor: this.appwindow.getThemeColor(),
            webPreferences: {
                webSecurity: false,
                //nodeIntegration:true,
                preload: path.join(__dirname, 'preload.js'),
                enableRemoteModule: true,
                contextIsolation: true,
            }
        })

        win.on('close', (event) => {
            event.preventDefault()
            //通知渲染进程要关闭窗口了，对数据进行保存操作
            win.webContents.send('main-closeWindow')
        })

        this._windows.push({
            id:win.id,
            win
        })
        
        return win
    }


    getWindowById(id){
        return this._windows.find(winInfo=>winInfo.id == id)
    }

    deleteWindowById(id){
        this._windows = this._windows.filter(winInfo=>{
            if(winInfo.id != id) return true
            win.removeAllListeners('close')
            win.webContents.closeDevTools()
            win.close()
        })
    }

    deleteWindow(win){
        this._windows = this._windows.filter(winInfo=>{
            if(winInfo.win != win) return true
            win.removeAllListeners('close')
            win.webContents.closeDevTools()
            win.close()
        })
    }

    getAllWindow(){
        return this._windows
    }

    updateShortKeyMap(keyMap){
        this._windows.forEach(({id,win})=>{
            win.webContents.send('main-setKeyMap',keyMap)
        })
    }
}

export default EditorWindowManager;