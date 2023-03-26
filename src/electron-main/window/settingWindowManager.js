import { BrowserWindow, nativeTheme } from 'electron'
import path from 'path'

class SettingWindowManager{
    constructor(appwindow) {
        //窗口映射，可携带数据
        this.appwindow = appwindow
        this._id = -1
        this._windows = null
    }

    createUnframeWindow(title) {

        if(this._id != -1 && this._windows && !this._windows.isDestroyed()){
            this._windows.moveTop()
            this._windows.center()
            return null
        }

        const win = new BrowserWindow({
            width: 1000,
            height: 618,
            icon: path.join(__static, "yali.png"),
            title: title,
            backgroundColor: '#ffffff',
            fullscreenable: false,
            fullscreen: false,
            minimizable: false,
            useContentSize: true,
            show: true,
            frame: false,
            thickFrame: true,
            webPreferences: {
                webSecurity: true,
                preload: path.join(__dirname, 'preload.js'),
                enableRemoteModule: true,
                contextIsolation: true,
            }
        })
        
        this._windows = win
        this._id = win.id
        return win
    }

    deleteWindow(win){
        if(win == this._windows && win.id == this._id)
        win.webContents.closeDevTools()
        win.close()

        this._id = -1
        this._windows = null
    }


}

export default SettingWindowManager;