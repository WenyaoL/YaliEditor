import { I18n } from 'i18n'
import {LOAD_LOCALE} from '../config'
import path from 'path'

class AppI18n {
    constructor(app) {
        this.app = app
        this.currLocale = app.store.get('currLocale','zh')
        this.i18n = new I18n({
            locales: LOAD_LOCALE,  //语言
            directory: path.join(__dirname, 'locales'), //语言包加载位置
            defaultLocale: this.currLocale, // 设置默认语言
        })
    }

    setLocale(locale){
        if(LOAD_LOCALE.indexOf(locale) == -1) return false
        this.i18n.setLocale(locale)
        this.currLocale = locale
        this.app.store.set('currLocale',locale)
        return true
    }

    t(src){
        return this.i18n.__(src)
    }
}

export default AppI18n