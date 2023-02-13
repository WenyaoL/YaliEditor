import {nativeTheme } from 'electron'

export default function (manager) {
    return {
        label: '主题(T)',
        submenu: [
            {
                label: 'light', type: 'radio', checked: manager.appWindow.theme == "light", click: () => {
                    manager.appWindow.checkoutTheme("light")
                    nativeTheme.themeSource = "light"

                }
            },
            {
                label: 'dark', type: 'radio', checked: manager.appWindow.theme == "dark", click: () => {
                    manager.appWindow.checkoutTheme('dark')
                    nativeTheme.themeSource = "dark"
                }
            },
        ]
    }
}