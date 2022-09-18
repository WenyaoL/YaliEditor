import fs from 'fs'
import path from 'path'
import { argv } from 'process';
import { app, protocol, BrowserWindow,Menu,dialog} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

export const CAN_READ_EXTENSION = ['.md','.txt','.markdown','.mkd','.mdown','.mkdn']



//opendialog and return filepaths
export function openFileDialog(){
    return dialog.showOpenDialog({
        filters:[{name:'markdown',extensions:['md','txt']}]
    })
}

//openddialog but only can open Directory
export function openFileDirDialogSync(){
    return dialog.showOpenDialogSync({
        properties:['openDirectory']
    })
}

//save dialog 
export function saveFileDialog(filter){


    if(filter){
        return dialog.showSaveDialog({
            filters:filter
        })
    }

    return dialog.showSaveDialog({
        filters:[{name:'markdown',extensions:['md']}]
    })
}



export function openFileSync(filePath){
    console.log('读取文件=='+filePath)
    //sync read file
    const data = fs.readFileSync(path.normalize(filePath),{encoding:'utf8', flag:'r'})
    return data
}

export async function openFile(filePath){
    if(isFile(filePath)) {
        return new Promise((resolve,reject)=>{
            fs.readFile(path.normalize(filePath),{encoding:'utf8', flag:'r'}, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    }
}
/**
 * create a empyt ApplicationContext
 * @returns 
 */
 export function createRenderApplicationContext(){
    return { 
        title:"undefine",
        filePath: null,
        content:"",
        preview:"",
        tree:[],
        viewEditor:null,
        isSave:true
    }
}

export function loadRenderApplicationContext(){
    const applicationContext = createRenderApplicationContext()
    if(argv.length == 2){
        const filePath = argv[1]
        //标题
        applicationContext.title = path.basename(filePath)
        //文件路径
        applicationContext.filePath = filePath
        
        //applicationContext.tree = openFileTreeSync(path.dirname(filePath))
        if (process.env.WEBPACK_DEV_SERVER_URL){
            console.log("开发环境");
            applicationContext.filePath = null
        }else{
            //文件内容
            applicationContext.content = openFileSync(filePath)
            //当前文件所在目录文件树
            createFileTree(path.dirname(filePath),applicationContext.tree)
        }
    }   
    return applicationContext
}


export function saveFile(filePath,data){
    console.log("保存路径",filePath);
    fs.writeFile(filePath,data,'utf8',err=>{
        if(err) console.log(err)
    })
}


export function openNewWindow(title){

    if(title == undefined){
        title = "Yalier"
    }
    const win = new BrowserWindow({
        width: 1000,
        height: 618,
        title:title,
        icon:path.join(__static,"yali.png"),
        webPreferences: {
          webSecurity:false,
          //nodeIntegration:true,
          preload:path.join(__dirname,'preload.js'),
          enableRemoteModule: true,
          contextIsolation: true,
        }
    })
    return win
}



export async function loadUrl(win){
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
      } else {
        createProtocol('app')
        win.loadURL('app://./index.html')
      }
}

export function openFileDirSync(dirPath){
    const data = fs.readdirSync(dirPath).map(fileName => {
        return path.join(dirPath, fileName)
      })
    return data;
}

export function isFile(path){
    return fs.lstatSync(path).isFile()
}

/**
 * 判断对象是否为空
 * @param {*} object 
 * @returns 
 */
export function isEmpty(object){
    return object == null || object ==undefined
}


export function verifyFile(fileName){
    let flag = false
    CAN_READ_EXTENSION.forEach((value)=>{
        flag = flag || fileName.endsWith(value)
    })
    return flag
}

export function openFileTreeSync(dirPath){

    return fs.readdirSync(dirPath).map(fileName => {
        const filePath = path.join(dirPath, fileName)
        if(isFile(filePath)){
            return {name:fileName,path:filePath}
        }else{
            return {name:fileName,path:filePath,child:openFileTreeSync(filePath)}
        }
    })
}

export function filterFileTree(tree){
    tree.filter(item=>{
        //文件夹向下递归
        if(item.child != undefined){
            filterFileTree(item.child)
            return true
        }
        //保留支持文件
        if(verifyFile(item.name)){
            return true
        }
        //剩余过滤
        return false
    })
}




export function createFileTree(dirPath,tree){
    fs.readdirSync(dirPath).forEach(fileName=>{
        const filePath = path.join(dirPath, fileName)
        if(isFile(filePath)){
            //是可打开文件才添加
            if(verifyFile(fileName)) tree.push({name:fileName,path:filePath})
        }else{
            const children = []
            createFileTree(filePath,children)
            tree.unshift({name:fileName,path:filePath,child:children})
        }
    })
}

/**
 * 读取字体文件
 */
export async function readFontFile(){
    const fontsPath = path.join(__static,  "fonts/SourceHanSans-normal");
    const fontsPath2 = path.join(__static,  "fonts/SourceHanSans-bold");
    
    console.log("读取字体文件",fontsPath);
    const normal =  await openFile(fontsPath)
    const bold = await openFile(fontsPath2)
    return {
        normal:normal,
        bold:bold
    }
}



export default {
    openFileDialog,
    openFileDirDialogSync,
    saveFileDialog,
    openFileSync,
    openFile,
    createRenderApplicationContext,
    loadRenderApplicationContext,
    saveFile,
    openNewWindow,
    loadUrl,
    openFileDirSync,
    isFile,
    isEmpty,
    verifyFile,
    openFileTreeSync,
    filterFileTree,
    createFileTree,
    readFontFile
}