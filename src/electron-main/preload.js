/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {

    //--------------------------------------调用（invoke）,有返回值（封装成Promise）-----------------------------------
    INVOKE: {
        //渲染进程请求读取文件内容
        readFile: async (payload) => ipcRenderer.invoke('renderer-readFile', payload),
        //渲染进程请求主进程保存文件
        saveFile: (payload) => ipcRenderer.invoke('renderer-saveFile', payload),
        //获取最近打开文件
        getRecentDocuments: () => ipcRenderer.invoke('renderer-getRecentDocuments'),
        //获取当前主题
        getCurrTheme: () => ipcRenderer.invoke('renderer-getCurrTheme'),
        //获取快捷键映射
        getKeyMap: () => ipcRenderer.invoke('renderer-getKeyMap'),
        //获取字体数据
        getFontsData: () => ipcRenderer.invoke('renderer-getFontsData'),
        //获取当前locale
        getCurrLocale: () => ipcRenderer.invoke('renderer-getCurrLocale'),
        
    },

    //--------------------------------------发送（send），无返回值-----------------------------------
    SEND: {
        //渲染进程提交要保存的dom元素的字符串，通过模板生成HTML文件
        saveHTMLFile: (payload) => ipcRenderer.send('renderer-saveHTMLFile', payload),
        //渲染进程请求主进程保存文件
        saveFile: (payload) => ipcRenderer.send('renderer-saveFile', payload),
        //渲染进程请求关闭窗口
        closeWindow: (payload) => ipcRenderer.send('renderer-closeWindow', payload),
        //添加最近打开文件
        addRecentDocument: (payload) => ipcRenderer.send('renderer-addRecentDocument', payload),
        //在新窗口打开文件
        openFileInNewWindow: (payload) => ipcRenderer.send('renderer-openFileInNewWindow', payload),

        //openURL打开一个url链接
        openURL: (payload) => ipcRenderer.send('renderer-openURL', payload),
        
        setKeyMap: (payload) => ipcRenderer.send('renderer-setKeyMap', payload),

        clearDataCache: (payload) => ipcRenderer.send('renderer-clearDataCache', payload),

        updateCurrLocale:(payload) => ipcRenderer.send('renderer-updateCurrLocale', payload),

    },

    //--------------------------------------监听（listener）-----------------------------------
    ON: {
        //设置渲染进程加载上下文
        setApplicationContext: (callback) => ipcRenderer.on('main-setApplicationContext', callback),
        
        //设置主题
        setTheme: (callback) => ipcRenderer.on('main-setTheme', callback),

        //渲染进程捕获content提交给主进程
        getContent: (callback) => ipcRenderer.on('main-getContent', callback),

        //渲染进程监听保存文件（回传上下文）
        saveFile: (callback) => ipcRenderer.on('main-saveFile', callback),

        //渲染进程监听另存为文件（回传上下文）
        saveAsFile: (callback) => ipcRenderer.on('main-saveAsFile', callback),

        setKeyMap: (callback) => ipcRenderer.on('main-setKeyMap', callback),

        setCurrLocale:(callback) => ipcRenderer.on('main-setCurrLocale', callback),

        //渲染进程绑定标题快捷键(单行式快捷键)
        createLine: (callback) => ipcRenderer.on('main-createLine', callback),
        //渲染进程绑定粗体快捷键(单词式快捷键)
        createType: (callback) => ipcRenderer.on('main-createType', callback),
        //渲染进程绑定代码块快捷键(块式快捷键)
        createBlock: (callback) => ipcRenderer.on('main-createBlock', callback),
        //渲染进程绑定多行渲染快捷键(多行式快捷键)
        createMulLine: (callback) => ipcRenderer.on('main-createMulLine', callback),
        //渲染进程绑定标题生成快捷键(toc)
        createToc: (callback) => ipcRenderer.on('main-createToc', callback),
        //渲染进程创建表格(Table)
        createTable: (callback) => ipcRenderer.on('main-createTable', callback),

        //文件树创建
        createFileTree: (callback) => ipcRenderer.on('main-createFileTree', callback),


        //监听导出PDF
        exportPDF: (callback) => ipcRenderer.on('main-exportPDF', callback),
        //监听导出图片
        exportIMG: (callback) => ipcRenderer.on('main-exportIMG', callback),
        //监听导出HTML
        exportHTML: (callback) => ipcRenderer.on('main-exportHTML', callback),

        //打口作者详情窗口
        openAuthorDetails: (callback) => ipcRenderer.on('main-openAuthorDetails', callback),
        //切换编辑模式
        checkoutEditModel: (callback) => ipcRenderer.on('main-checkoutEditModel', callback),
        //隐藏/显示侧边栏
        checkoutSidebarDisplay: (callback) => ipcRenderer.on('main-checkoutSidebarDisplay', callback),

        //关闭应用窗口监听
        closeWindow: (callback) => ipcRenderer.on('main-closeWindow', callback),

        //handle errorMessage from main process
        handleErrorMessage: (callback) => ipcRenderer.on('main-handleErrorMessage',callback),

        //测试接口
        test: (callback) => ipcRenderer.on('test', callback),
    }



})