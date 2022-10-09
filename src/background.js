'use strict'

import { app, protocol, BrowserWindow,Menu, ipcMain, dialog} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import appMenu  from '@/electron-main/appMenu'
import rightMenu from '@/electron-main/rightMenu'
import {loadRenderApplicationContext} from '@/electron-main/common'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import { request } from 'http'
import loadIPCHandle from './electron-main/ipmMainLoad'
import path from 'path'



const isDevelopment = process.env.NODE_ENV !== 'production'

let win;
let isReady=false;


// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])


async function createWindow() {

  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    height: 618,
    icon:path.join(__static,"yali.png"),
    webPreferences: {
      webSecurity:false,
      //nodeIntegration:true,
      preload:path.join(__dirname,'preload.js'),
      enableRemoteModule: true,
      contextIsolation: true,
      //contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  win.on('close',(event)=>{
    event.preventDefault()
    win.webContents.send('closeWindow')
    //win.close()
    
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    //win.loadURL(path.join(__static,"index.html"))
    win.loadURL('app://./index.html')
    //win.loadURL('app://./home')
  }
  //加载菜单 load Menu
  appMenu.build()
  //rightMenu.build(win)
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {

  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
  

  //加载ipchandle
  loadIPCHandle.load()

  createWindow()
  protocol.interceptFileProtocol('file', (request, callback) => {
    const url = request.url.substring(8)
    callback(decodeURI(path.normalize(url)))
  })
  //应用打开的第一个文件应该去加载数据
  const renderApplicationContext =  loadRenderApplicationContext()
  win.webContents.send("updateApplicationContext",renderApplicationContext)
  isReady = true;

})




app.on('open-file',async (event,path)=>{
  event.preventDefault()
  //mac book used
  if(isReady){

  }
})


// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
