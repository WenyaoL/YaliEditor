/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { BrowserWindow, Menu,ipcMain,dialog} from 'electron'
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
                        const win = this.manager.appWindow.createWindow(path.basename(filePath))
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
                                filePath: filePath,   //文件路径
                                content:data,
                                preview:"",  
                                isSave:true,
                                theme:this.manager.appWindow.theme
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
                    console.log('触发代码块快捷')
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createBlock',{type:"codeblock"})
                }},
                {label:'公式块', accelerator:'ctrl+shift+M',click:()=>{
                    console.log('触发公式块快捷')
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createBlock',{type:"mathblock"})
                }},
                {type: 'separator'},
                {label:'有序列表', accelerator:'ctrl+shift+[',click:()=>{
                    console.log('触发有序列表快捷')
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createMulLine',{type:"list"})
                }},
                {label:'无序列表', accelerator:'ctrl+shift+]',click:()=>{
                    console.log('触发无序列表快捷')
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createMulLine',{type:"unlist"})
                }},
                {type: 'separator'},
                {label:'引用', accelerator:'ctrl+shift+q',click:()=>{
                    console.log('触发引用快捷')
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

                }},
                {label:'dark',type: 'radio',click:()=>{
                    this.manager.appWindow.checkoutTheme('dark')
                }},
            ]
        })
    }

    initVisitMenu(){
        this.template.push({
            label:'&V视图',
            submenu:[
                
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



export function build(){
    var template = [
        {
            label:'文件(F)',
            submenu:[
                {
                    label:'新建',//标签名
                    accelerator:'ctrl+n',//快捷键
                    click:()=>{
                        //open new window
                        const win = common.openNewWindow()
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
                        //open new window
                        const win = common.openNewWindow()
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
                                isSave:true
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
                        BrowserWindow.getFocusedWindow().close()
                    }
                },
            ]
        },
        {
            label:'编辑(E)',
            submenu:[
                {label:'复制', role:'copy', accelerator:'ctrl+c'},
                {label:'粘贴', role: 'paste', accelerator:'ctrl+v'},
                {label:'剪切', role: 'cut', accelerator:'ctrl+x'},
                {label:'删除', role: 'delete', accelerator:'ctrl+d'},
                {label:'全选', role: 'selectall', accelerator:'ctrl+a'},
                {label:'撤销', role: 'undo', accelerator:'ctrl+z'},
            ]
        },
        {
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
                    console.log('触发代码块快捷')
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createBlock',{type:"codeblock"})
                }},
                {label:'公式块', accelerator:'ctrl+shift+M',click:()=>{
                    console.log('触发公式块快捷')
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createBlock',{type:"mathblock"})
                }},
                {type: 'separator'},
                {label:'有序列表', accelerator:'ctrl+shift+[',click:()=>{
                    console.log('触发有序列表快捷')
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createMulLine',{type:"list"})
                }},
                {label:'无序列表', accelerator:'ctrl+shift+]',click:()=>{
                    console.log('触发无序列表快捷')
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('createMulLine',{type:"unlist"})
                }},
                {type: 'separator'},
                {label:'引用', accelerator:'ctrl+shift+q',click:()=>{
                    console.log('触发引用快捷')
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
        },
        {
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
        },
        {
            label:'主题(T)',
            submenu:[
                {label:'light',type: 'radio',checked: true,click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('selectTheme',{type:"light"})
                }},
                {label:'dark',type: 'radio',click:()=>{
                    BrowserWindow.getFocusedWindow()
                                .webContents
                                .send('selectTheme',{type:"dark"})
                }},
            ]
        },
        {
            label:'&V视图',
            submenu:[
                
            ]
        },
        {
            label:'关于(A)',
            submenu:[
                {label:'作者',click:()=>{
                    BrowserWindow.getFocusedWindow().webContents.send("openAuthorDetails")
                }},
                {label:'打开开发者工具',click:()=>{
                    BrowserWindow.getFocusedWindow().webContents.openDevTools()
                }},
            ]
        }
    ]
    
    var m = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(m)
    
}

export default {
    AppMenu,
    build
}

