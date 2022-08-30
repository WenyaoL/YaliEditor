const {contextBridge,ipcRenderer} = require('electron')

console.log('加载预加载脚本');

contextBridge.exposeInMainWorld('electronAPI', {


    //--------------------------------------调用（invoke）-----------------------------------
    //渲染进程请求读取文件内容
    readFile: async (payload) => ipcRenderer.invoke('readFile',payload),
    //渲染进程请求加载上下文
    loadRenderApplicationContext: async () => ipcRenderer.invoke('loadRenderApplicationContext'),
    //渲染进程请求打开文件保存信息框
    openSaveMsgDialog: () => ipcRenderer.invoke('openSaveMsgDialog'),
    //渲染进程请求主进程保存文件
    invokeSave:(payload) => ipcRenderer.invoke('saveFile',payload),
    //--------------------------------------发送（send）-----------------------------------
    

    

    //--------------------------------------监听（listener）-----------------------------------
    //渲染进程加载Content
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
    //文件树创建
    createFileTree: (callback) => ipcRenderer.on('createFileTree',callback),
    //渲染进程监听保存文件（回传上下文）
    saveFile: (callback) => ipcRenderer.on('saveFile',callback),

    

    //测试接口
    test:(callback)=> ipcRenderer.on('test',callback),
})