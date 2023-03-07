'use strict'

import { app, protocol, BrowserWindow} from 'electron'
import path from 'path'
import { AppManager } from './appManager'


const isDevelopment = process.env.NODE_ENV !== 'production'

let isReady=false;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])



// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {

  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', () => {
  let appManager = new AppManager()
  appManager.init()

  let win = appManager.appWindow.editorWindowManager.createWindow()

  //加载第一个页面
  appManager.loadFirstPage(win)
  
  protocol.interceptFileProtocol('file', (request, callback) => {
    const url = request.url.substring(8)
    callback(decodeURI(path.normalize(url)))
  })
  
  //应用打开的第一个文件应该去加载数据
  /*const renderApplicationContext =  loadRenderApplicationContext()
  win.webContents.send("updateApplicationContext",renderApplicationContext)
  isReady = true;*/

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
