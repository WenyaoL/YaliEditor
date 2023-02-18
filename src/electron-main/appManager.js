/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import AppMenu from './menu'
import AppWindow from './window/index'
import {MainIPMEventLoader} from './ipmMainLoad'

import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import path from 'path'
import Store from 'electron-store'
import {app} from 'electron'
import {defaultKeyMap} from './config'
import AppFileSystem from './fileSystem'

export class AppManager{


    constructor(){
        this.appWindow = new AppWindow(this)
        this.appMenu = new AppMenu(this)
        this.appFileSystem = new AppFileSystem(this)
        this.store = new Store({
            clearInvalidConfig:true,
            schema:{
                theme:{
                    type:'string',
                    default:'light',
                    description:'主题类型'
                },
                recentDocuments:{
                    type:'array',
                    default:[],
                    description:'最近打开文件列表,{fileName:"文件名",dirName:"目录名",description:"文章前几行的文本信息"}'
                },
                currKeyMap:{
                    type:'object',
                    default:Object.fromEntries(defaultKeyMap.entries()),
                    description:'快捷键映射'
                }
            }
        })
        this.mainIPMEventLoader = new MainIPMEventLoader(this)

    }

    /**
     * 初始化
     */
    init(){
        this.appWindow.init()
        //appMenu初始化应该在appWindow之后
        this.appMenu.init()
        this.mainIPMEventLoader.load()
    }

    /**
     * 加载第一个页面
     */
    loadFirstPage(win){
        if (process.env.WEBPACK_DEV_SERVER_URL) {
            win.loadURL(process.env.WEBPACK_DEV_SERVER_URL).then(()=>{
              if (!process.env.IS_TEST) win.webContents.openDevTools()
              //发送数据
              win.webContents.send('updateApplicationContext',{   //上下文
                title:"Yalier",
                isSave:true,
                theme:this.appWindow.theme
              })
            })
        }else{
            createProtocol('app')
            //读取打开文件路径
            let filePath = process.argv[1]
            if(!filePath){
                win.loadURL('app://./index.html').then(()=>{
                    //发送数据
                    win.webContents.send('updateApplicationContext',{   //上下文
                        title:"Yalier",
                        isSave:true,
                        theme:this.appWindow.theme
                    })
                })
                return 
            }

            this.appFileSystem.openFile(filePath).then(data=>{
                let appWindow = this.appWindow
                win.loadURL('app://./index.html').then(()=>{
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


    /**
     * 添加最近打开文件
     * @param {*} filePath 文件全路径(包含文件本身)
     */
    addRecentDocument(filePath,description){
        let recentDocuments = [],
            fileName = path.basename(filePath),
            dirName = path.dirname(filePath)
        app.addRecentDocument(filePath)


        recentDocuments = this.store.get('recentDocuments',[])
        let index = recentDocuments.findIndex(item=>item.fileName == fileName && item.dirName == dirName)
        if(index>=0){
            recentDocuments = recentDocuments.splice(index,1).concat(recentDocuments)
        }else{
            //判断是否越界
            if(recentDocuments.length >15) recentDocuments.pop()
            recentDocuments.unshift({
                fileName,
                dirName,
                description
            })
            this.store.set('recentDocuments',recentDocuments)
        }
        
        this.appMenu.updateMenu()
    }

    /**
     * 获取最近打开列表
     * @returns recentDocuments Array
     */
    getRecentDocuments(){
        return this.store.get('recentDocuments',[])
    }

    clearRecentDocuments(){
        this.store.set('recentDocuments',[])
        app.clearRecentDocuments()
        this.appMenu.updateMenu()
    }

    getCurrKeyMap(){
        const keyObject = this.store.get('currKeyMap')
        if(!keyObject || keyObject == {}){
            this.store.set('currKeyMap',Object.fromEntries(defaultKeyMap.entries()))
            return defaultKeyMap
        }
        return new Map(Object.entries(keyObject))
    }

    setCurrKeyMap(map){
        //持久化
        this.store.set("currKeyMap",Object.fromEntries(map.entries()))
        //通知窗口去更新keyMap
        this.appWindow.editorWindowManager.updateShortKeyMap(map)
        this.appMenu.updateMenu()
    }


    clearDataCache(){
        this.store.clear()
    }
}

