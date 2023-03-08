import {nativeTheme } from 'electron'

export default function (app) {
    const i18n = app.appI18n
    return {
        label: i18n.t('THEME_'),
        submenu: [
            {
                label: i18n.t('THEME_light'), type: 'radio', checked: app.appWindow.theme == "light", click: () => {
                    app.appWindow.checkoutTheme("light")
                    nativeTheme.themeSource = "light"

                }
            },
            {
                label: i18n.t('THEME_dark'), type: 'radio', checked: app.appWindow.theme == "dark", click: () => {
                    app.appWindow.checkoutTheme('dark')
                    nativeTheme.themeSource = "dark"
                }
            },
        ]
    }
}