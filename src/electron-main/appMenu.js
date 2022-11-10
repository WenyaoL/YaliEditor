/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { BrowserWindow, Menu,ipcMain,dialog,shell, app,nativeTheme} from 'electron'
//import { openFile,openFileDialog,openNewWindow,loadUrl} from './common'
import common from './common'
import path from 'path'


export class AppMenu{
    
    constructor(manager){
        this.template = []
        this.manager = manager
        
    }

    init(){
        this.initFileMenu()
        this.initEditMenu()
        this.initParagraphMenu()
        this.initFormatMenu()
        this.initThemeMenu()
        this.initVisitMenu()
        this.initAboutMenu()
        this.build()
    }

    initFileMenu(){
        this.template.push({
            label:'文件(F)',
            submenu:[
                {
                    label:'新建',//标签名
                    accelerator:'ctrl+n',//快捷键
                    click:()=>{
                        //open new window
                        const win = this.manager.appWindow.createWindow()
                        //const win = common.openNewWindow()
                        this.manager.appWindow.addWindow(win)
                        //加载页面 window load url
                        common.loadUrl(win)
                    }
                },
                {type: 'separator'},
                {
                    label:'打开',
                    accelerator:'ctrl+o', 
                    click:async ()=>{
                        //打开文件对话框
                        const select =await common.openFileDialog()
                        const filePath = select.filePaths[0]
                        //打开文件
                        const data = common.openFileSync(filePath)
                        //加入store,保存最近打开文件
                        this.manager.addRecentDocument(filePath,data.substring(0,30))
                        //open new window
                        const win = this.manager.appWindow.createWindow(path.basename(filePath))
                        //const win = common.openNewWindow()
                        this.manager.appWindow.addWindow(win)
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
                    }
                },{
                    label:'打开文件夹',
                    click: ()=>{
                        const select =common.openFileDirDialogSync()
                        if(select != undefined){
                            let tree = common.openFileTreeSync(select[0],8)
                            tree = common.filterFileTree(tree)
                            BrowserWindow.getFocusedWindow().webContents.send('createFileTree',{tree:tree})
                        }
                    }
                },{
                    label:'最近打开文件',
                    role:"recentdocuments",
                    submenu:[
                        {label:"清空最近文件",
                        click:()=>{
                            this.manager.clearRecentDocuments()
                        }}
                    ]
                },
                {type: 'separator'},
                {
                    label:'保存',
                    accelerator:'ctrl+s',
                    click:()=>{
                        //触发保存事件
                        BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('saveFile')
                    }
                },{
                    label:'另存为',
                    accelerator:'ctrl+shift+s',
                    click:async ()=>{
                        //打开文件对话框
                        const select =await common.saveFileDialog()
                        //发送catchContent事件,渲染进程会回传数据，并在主进程的监听器中处理数据保存
                        BrowserWindow.getFocusedWindow().webContents.send('saveFile',{path:select.filePath})
                    }
                },
                {type: 'separator'},
                {
                    label:'导出',
                    submenu:[
                        {label:'PDF', click:()=>{BrowserWindow.getFocusedWindow().webContents.send('exportPDF')}},
                        {label:'图片(png)', click:()=>{BrowserWindow.getFocusedWindow().webContents.send('exportIMG')}},
                        {label:'HTML', click:()=>{BrowserWindow.getFocusedWindow().webContents.send('exportHTML')}},
                    ]
                },{
                    label:'加载',
                    accelerator:'ctrl+l',
                    click:async ()=>{
                        //打开文件对话框
                        const select =await common.openFileDialog()
                        const filePath = select.filePaths[0]
                        //打开文件
                        const data = common.openFileSync(filePath)
                        //加入store,保存最近打开文件
                        this.manager.addRecentDocument(filePath,data.substring(0,30))
                        BrowserWindow
                        .getFocusedWindow()
                        .webContents
                        .send('updateApplicationContext',{   //上下文
                            title:path.basename(filePath),
                            filePath: filePath,   //文件路径
                            content:data,
                            preview:"",  
                            isSave:true
                          })
                    }
                },{
                    label:'关闭',
                    accelerator:'ctrl+w',
                    click:()=>{
                        let win = BrowserWindow.getFocusedWindow()
                        this.manager.removeWindow(win)
                        win.close()
                    }
                },
            ]
        })
        
    }


    initEditMenu(){
        this.template.push({
            label:'编辑(E)',
            submenu:[
                {label:'复制', role:'copy', accelerator:'ctrl+c'},
                {label:'粘贴', role: 'paste', accelerator:'ctrl+v'},
                {label:'剪切', role: 'cut', accelerator:'ctrl+x'},
                {label:'删除', role: 'delete', accelerator:'ctrl+d'},
                {label:'全选', role: 'selectall', accelerator:'ctrl+a'},
                {label:'撤销', role: 'undo', accelerator:'ctrl+z'},
            ]
        })
    }

    initParagraphMenu(){
        this.template.push({
            label:'段落(P)',
            submenu:[
                {label:'一级标题', accelerator:'ctrl+1',click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createLine',{type:"head",level:1})
                }},
                {label:'二级标题', accelerator:'ctrl+2',click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createLine',{type:"head",level:2})
                }},
                {label:'三级标题', accelerator:'ctrl+3',click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createLine',{type:"head",level:3})
                }},
                {label:'四级标题', accelerator:'ctrl+4',click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createLine',{type:"head",level:4})
                }},
                {label:'五级标题', accelerator:'ctrl+5',click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createLine',{type:"head",level:5})
                }},
                {label:'六级标题', accelerator:'ctrl+6',click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createLine',{type:"head",level:6})
                }},
                {type: 'separator'},
                {label:'代码块', accelerator:'ctrl+shift+k',click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createBlock',{type:"codeblock"})
                }},
                {label:'公式块', accelerator:'ctrl+shift+M',click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createBlock',{type:"mathblock"})
                }},
                {type: 'separator'},
                {label:'有序列表', accelerator:'ctrl+shift+[',click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createMulLine',{type:"list"})
                }},
                {label:'无序列表', accelerator:'ctrl+shift+]',click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createMulLine',{type:"unlist"})
                }},
                {type: 'separator'},
                {label:'引用', accelerator:'ctrl+shift+q',click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createMulLine',{type:"quote"})
                }},
                {label:'目录', accelerator:'ctrl+shift+t',click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createToc')
                }},
                {label:'创建表格', click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createTable')
                }}
            ]
        })
    }

    initFormatMenu(){
        this.template.push({
            label:'格式(O)',
            submenu:[
                {label:'加粗', accelerator:'ctrl+b',click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createType',{type:"blod"})
                }},
                {label:'下划线', accelerator:'ctrl+u',click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createType',{type:"underline"})
                }},
                {label:'斜体', accelerator:'ctrl+i',click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createType',{type:"italic"})
                }},
                {label:'代码', accelerator:'ctrl+shift+`',click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createType',{type:"codeline"})
                }},
                {label:'删除线', accelerator:'ctrl+shift+5',click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createType',{type:"deleteline"})
                }},
            ]
        })
    }

    initThemeMenu(){
        this.template.push({
            label:'主题(T)',
            submenu:[
                {label:'light',type: 'radio',checked: true,click:()=>{
                    this.manager.appWindow.checkoutTheme("light")
                    nativeTheme.themeSource = "light"

                }},
                {label:'dark',type: 'radio',click:()=>{
                    this.manager.appWindow.checkoutTheme('dark')
                    nativeTheme.themeSource = "dark"
                }},
            ]
        })
    }

    initVisitMenu(){
        this.template.push({
            label:'视图(V)',
            submenu:[
                {label:'显示/隐藏侧边栏',click:()=>{
                    BrowserWindow
                    .getFocusedWindow()
                    .webContents
                    .send('checkoutSidebarDisplay')
                }},
                {type: 'separator'},
                {label:'放大',role: 'zoomIn'},
                {label:'缩小',role: 'zoomOut'},
                {label:'重置缩放',role: 'resetZoom'},
                {type: 'separator'},
                {label:'源码模式',click:()=>{
                    BrowserWindow
                    .getFocusedWindow()
                    .webContents
                    .send('checkoutEditModel',{editModel:'ONLY'})
                }},
                {label:'SV模式',click:()=>{
                    BrowserWindow
                    .getFocusedWindow()
                    .webContents
                    .send('checkoutEditModel',{editModel:'SV'})
                }},
                {label:'IR模式',click:()=>{
                    BrowserWindow
                    .getFocusedWindow()
                    .webContents
                    .send('checkoutEditModel',{editModel:'IR'})
                }},
                {type: 'separator'},
                {label:'全屏',type:'checkbox',click:()=>{
                    let isFull =  BrowserWindow.getFocusedWindow().isFullScreen()
                    BrowserWindow.getFocusedWindow().setFullScreen(!isFull)
                }},
                
            ]
        })
    }

    initAboutMenu(){
        this.template.push({
            label:'关于(A)',
            submenu:[
                {label:'作者',click:()=>{
                    BrowserWindow.getFocusedWindow().webContents.send("openAuthorDetails")
                }},
                {label:'帮助文档',click:()=>{
                    //打开文件
                    const filePath = path.join(__static,"docs/Help.md")
                    const data = common.openFileSync(filePath)
                    //open new window
                    const win = this.manager.appWindow.createWindow(path.basename(filePath))
                    this.manager.appWindow.addWindow(win)
                    //加载页面 window load url
                    common.loadUrl(win)
                    //页面加载完
                    win.on('ready-to-show',()=>{
                        //发送数据
                        win.webContents.send('updateApplicationContext',{   //上下文
                            title:path.basename(filePath),
                            filePath: filePath,   //文件路径
                            content:data,
                            preview:"",  
                            isSave:true,
                            theme:this.manager.appWindow.theme
                        })
                    })
                }},
                {label:'开发文档',click:()=>{
                    //打开文件
                    const filePath = path.join(__static,"docs/Development.md")
                    const data = common.openFileSync(filePath)
                    //open new window
                    const win = this.manager.appWindow.createWindow(path.basename(filePath))
                    this.manager.appWindow.addWindow(win)
                    //加载页面 window load url
                    common.loadUrl(win)
                    //页面加载完
                    win.on('ready-to-show',()=>{
                        //发送数据
                        win.webContents.send('updateApplicationContext',{   //上下文
                            title:path.basename(filePath),
                            filePath: filePath,   //文件路径
                            content:data,
                            preview:"",  
                            isSave:true,
                            theme:this.manager.appWindow.theme
                        })
                    })
                }},
                {label:'Github',click:()=>{
                    shell.openExternal('https://github.com/WenyaoL/YaliEditor')
                }},
                {label:'打开开发者工具',click:()=>{
                    BrowserWindow.getFocusedWindow().webContents.openDevTools()
                }},

            ]
        })
    }

    build(){
        var m = Menu.buildFromTemplate(this.template)
        Menu.setApplicationMenu(m)
    }
}





export default {
    AppMenu,
}

