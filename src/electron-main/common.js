/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { defaultApplicationContext } from './config';

export const CAN_READ_EXTENSION = ['.md', '.txt', '.markdown', '.mkd', '.mdown', '.mkdn']



/**
 * create a empyt ApplicationContext
 * @returns 
 */
export function createRenderApplicationContext() {
    return defaultApplicationContext
}



export async function loadUrl(win) {
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        //createProtocol('app')
        return win.loadURL('app://./index.html')
    }
}

export async function loadPreferenceSettingUrl(win){
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL+"?type=preference")
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        //createProtocol('app')
        return win.loadURL('app://./index.html?type=preference')
    }
}


/**
 * 判断对象是否为空
 * @param {*} object 
 * @returns 
 */
export function isEmpty(object) {
    return object == null || object == undefined
}




export default {
    
    createRenderApplicationContext,
    loadUrl,
    loadPreferenceSettingUrl,
    
    isEmpty,
}