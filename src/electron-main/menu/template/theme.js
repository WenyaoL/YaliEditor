import {nativeTheme } from 'electron'

export default function (app) {
    return {
        label: '主题(T)',
        submenu: [
            {
                label: 'light', type: 'radio', checked: app.appWindow.theme == "light", click: () => {
                    app.appWindow.checkoutTheme("light")
                    nativeTheme.themeSource = "light"

                }
            },
            {
                label: 'dark', type: 'radio', checked: app.appWindow.theme == "dark", click: () => {
                    app.appWindow.checkoutTheme('dark')
                    nativeTheme.themeSource = "dark"
                }
            },
        ]
    }
}