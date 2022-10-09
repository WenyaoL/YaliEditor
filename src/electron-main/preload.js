/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
const {contextBridge,ipcRenderer} = require('electron')

console.log('加载预加载脚本');

contextBridge.exposeInMainWorld('electronAPI', {


    //--------------------------------------调用（invoke）-----------------------------------
    //渲染进程请求读取文件内容
    readFile: async (payload) => ipcRenderer.invoke('readFile',payload),
    //渲染进程请求打开文件保存信息框
    openSaveMsgDialog: () => ipcRenderer.invoke('openSaveMsgDialog'),

    //openURL打开一个url链接
    openURL:(payload) => ipcRenderer.invoke('openURL',payload),
    //打开帮助文档
    openHelpDocumentation:()=> ipcRenderer.invoke('openHelpDocumentation'),

    //--------------------------------------发送（send）-----------------------------------
    //渲染检查请求加载Fonts
    loadFonts:(payload) => ipcRenderer.send('loadFonts',payload),
    //渲染进程提交要保存的dom元素的字符串，通过模板生成HTML文件
    saveHTMLFile:(payload) => ipcRenderer.send('saveHTMLFile',payload),
    //渲染进程请求主进程保存文件
    invokeSave:(payload) => ipcRenderer.send('saveFile',payload),
    //渲染进程请求关闭窗口
    invokeCloseWin:(payload) => ipcRenderer.send('close-window',payload),


    //--------------------------------------监听（listener）-----------------------------------
    //渲染进程加载上下文
    updateApplicationContext: (callback) => ipcRenderer.on('updateApplicationContext',callback),
    //渲染进程捕获content提交给主进程
    catchContent: (callback) => ipcRenderer.on('catchContent',callback),
    //渲染进程绑定标题快捷键(单行式快捷键)
    createLine: (callback) => ipcRenderer.on('createLine',callback),
    //渲染进程绑定粗体快捷键(单词式快捷键)
    createType: (callback) => ipcRenderer.on('createType',callback),
    //渲染进程绑定代码块快捷键(块式快捷键)
    createBlock: (callback) => ipcRenderer.on('createBlock',callback),
    //渲染进程绑定多行渲染快捷键(多行式快捷键)
    createMulLine: (callback) => ipcRenderer.on('createMulLine',callback),
    //渲染进程绑定标题生成快捷键(toc)
    createToc: (callback) => ipcRenderer.on('createToc',callback),
    //渲染进程创建表格(Table)
    createTable: (callback) => ipcRenderer.on('createTable',callback),
    
    //文件树创建
    createFileTree: (callback) => ipcRenderer.on('createFileTree',callback),
    //渲染进程监听保存文件（回传上下文）
    saveFile: (callback) => ipcRenderer.on('saveFile',callback),

    //加载字体数据(监听loadFonts返回的异步数据)
    initFonts:(callback) => ipcRenderer.on('initFonts',callback),

    //监听导出PDF
    exportPDF:(callback) => ipcRenderer.on('exportPDF',callback),
    //监听导出图片
    exportIMG:(callback) => ipcRenderer.on('exportIMG',callback),
    //监听导出HTML
    exportHTML:(callback) => ipcRenderer.on('exportHTML',callback),

    //开口作者详情窗口
    openAuthorDetails:(callback) => ipcRenderer.on('openAuthorDetails',callback),

    //关闭应用窗口监听
    closeWindow:(callback) => ipcRenderer.on('closeWindow',callback),

    //测试接口
    test:(callback)=> ipcRenderer.on('test',callback),
})