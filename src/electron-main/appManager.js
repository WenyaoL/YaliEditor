/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import {AppMenu} from './appMenu'
import {AppWindow} from './appWindow'
import {openFile} from './common'
import path from 'path'
import Store from 'electron-store'

export class AppManager{


    constructor(){
        this.appWindow = new AppWindow(this)
        this.appMenu = new AppMenu(this)
        this.store = new Store({
            schema:{
                theme:{
                    type:'string',
                    default:'light'
                }
            }
        })
    }

    init(){
        this.appMenu.init()
        this.appWindow.init()
    }

    /**
     * 加载第一个页面
     */
    loadFirstPage(win){
        //读取打开文件路径
        let filePath = process.argv[1]
        if(!filePath) return
        openFile(filePath).then(data=>{
            let appWindow = this.appWindow
            win.on('ready-to-show',()=>{
                //发送数据
                win.webContents.send('updateApplicationContext',{   //上下文
                    title:path.basename(filePath),
                    filePath: filePath,   //文件路径
                    content:data,
                    preview:"",  
                    isSave:true,
                    theme:appWindow.theme
                })
            })
        })

    }

}

