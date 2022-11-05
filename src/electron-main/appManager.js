/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import {AppMenu} from './appMenu'
import {AppWindow} from './appWindow'
import {MainIPMEventLoader} from './ipmMainLoad'
import {openFile} from './common'
import path from 'path'
import Store from 'electron-store'
import {app} from 'electron'

export class AppManager{


    constructor(){
        this.appWindow = new AppWindow(this)
        this.appMenu = new AppMenu(this)
        this.store = new Store({
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
                }
            }
        })
        this.mainIPMEventLoader = new MainIPMEventLoader(this)
    }

    /**
     * 初始化
     */
    init(){
        this.appMenu.init()
        this.appWindow.init()
        this.mainIPMEventLoader.load()
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
            return 
        }else{
            //判断是否越界
            if(recentDocuments.length >30) recentDocuments.pop()
            recentDocuments.unshift({
                fileName,
                dirName,
                description
            })
            this.store.set('recentDocuments',recentDocuments)
        }
        
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
    }

}

