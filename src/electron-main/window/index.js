/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import { BrowserWindow, nativeTheme } from 'electron'
import EditorWindowManager from './editorWindowManager'
import SettingWindowManager from './settingWindowManager'
import path from 'path'



class AppWindow {

    constructor(app) {
        //窗口映射，可携带数据
        this.app = app
        this.theme = "light"
        this.editorWindowManager = new EditorWindowManager(this)
        this.settingWindowManager = new SettingWindowManager(this)
    }

    init() {
        const theme = this.app.store.get('theme', 'light')

        if (this.theme == "dark") nativeTheme.themeSource = "dark"
        else nativeTheme.themeSource = "light"

    }

    closeWindow(win){
        this.editorWindowManager.deleteWindow(win)
        this.settingWindowManager.deleteWindow(win)
    }

    
    /**
     * 切换所有窗口的主题
     */
    checkoutTheme(theme) {
        this.editorWindowManager.getAllWindow().forEach(({id,win})=>{
            //通知窗口更新主题色
            win.webContents.send('main-setTheme', { type: theme })
        })
        //将配置持久化
        this.app.store.set('theme', theme)
        if (this.theme == "dark") nativeTheme.themeSource = "dark"
        else nativeTheme.themeSource = "light"
        this.theme = theme
    }

    hideSidebar() {
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('main-hideSidebar')
        })
    }

    expandSidebar() {
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('main-expandSidebar')
        })
    }

    updateLocale(locale){
        this.editorWindowManager.getAllWindow().forEach(({id,win})=>{
            win.webContents.send('main-setCurrLocale',locale)
        })

        if(this.settingWindowManager._windows)this.settingWindowManager._windows.webContents.send('main-setCurrLocale',locale)
    }

    getThemeColor() {
        if (this.theme == "light") return "#ffffff"
        else if (this.theme == "dark") return "#333333"
        return "#ffffff"
    }

}

export default AppWindow