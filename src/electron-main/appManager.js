/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

import {AppMenu} from './appMenu'
import {AppWindow} from './appWindow'
import Store from 'electron-store'

export class AppManager{


    constructor(){
        this.appWindow = new AppWindow(this)
        this.appMenu = new AppMenu(this)
        this.store = new Store({
            schema:{
                theme:{
                    type:'string',
                    default:'light'
                }
            }
        })
    }

    init(){
        this.appMenu.init()
        this.appWindow.init()
    }



}

